import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// ─── Cloudinary setup ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'escort_provider_ads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [{ width: 1200, height: 1600, crop: 'limit', quality: 'auto' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function decodeToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw Object.assign(new Error('No token provided'), { status: 401 });
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw Object.assign(new Error('Invalid or expired token'), { status: 401 });
  }
}

// Loose numeric equality — MySQL returns INT, JWT encodes number
function isSameUser(dbUserId, tokenUserId) {
  return Number(dbUserId) === Number(tokenUserId);
}

// Pull Cloudinary secure_url from the file object (multer-storage-cloudinary v4)
function getUploadUrl(file) {
  return file.path || file.secure_url || null;
}

// ─── GET all ads ──────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  const { city, featured, sort, limit } = req.query;

  let query = `
    SELECT a.*, c.name AS city_name, c.slug AS city_slug,
           s.name AS state_name, s.code AS state_code
    FROM ads a
    LEFT JOIN cities c ON a.city_id = c.id
    LEFT JOIN states s ON c.state_id = s.id
  `;
  const params = [];

  const conditions = [];
  if (city)     { conditions.push('c.slug = ?');     params.push(city); }
  if (featured) { conditions.push('a.is_featured = 1'); }
  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');

  query += sort === 'random' ? ' ORDER BY RAND()' : ' ORDER BY a.created_at DESC';

  if (limit) { query += ' LIMIT ?'; params.push(parseInt(limit, 10)); }

  try {
    const [ads] = await pool.query(query, params);
    res.json(ads);
  } catch (err) {
    console.error('GET /ads error:', err);
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
});

// ─── GET single ad ────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, c.name AS city_name, c.slug AS city_slug,
              s.name AS state_name, s.code AS state_code
       FROM ads a
       LEFT JOIN cities c ON a.city_id = c.id
       LEFT JOIN states s ON c.state_id = s.id
       WHERE a.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Ad not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /ads/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch ad' });
  }
});

// ─── POST new ad ──────────────────────────────────────────────────────────────
router.post('/', (req, _res, next) => {
  // Authenticate BEFORE multer uploads anything to Cloudinary
  try {
    req.decodedUser = decodeToken(req);
    next();
  } catch (err) {
    next(err);
  }
}, upload.array('photos', 4), async (req, res) => {
  try {
    const { title, description, age, city_id } = req.body;
    const decoded = req.decodedUser;

    if (!title || !city_id) {
      return res.status(400).json({ error: 'Title and city are required' });
    }

    const photoUrls = req.files?.length
      ? req.files.map(getUploadUrl).filter(Boolean)
      : req.body.photo_url ? [req.body.photo_url] : [];

    // Check balance — admins are exempt
    if (decoded.role !== 'admin') {
      const [users] = await pool.execute(
        'SELECT wallet_balance FROM users WHERE id = ?', [decoded.id]
      );
      if (!users.length || Number(users[0].wallet_balance) < 10) {
        return res.status(400).json({ error: 'Insufficient balance. You need at least $10 to post an ad.' });
      }
    }

    await pool.execute(
      'INSERT INTO ads (user_id, title, description, age, city_id, photo_url) VALUES (?, ?, ?, ?, ?, ?)',
      [decoded.id, title, description || '', age || null, city_id, JSON.stringify(photoUrls)]
    );

    if (decoded.role !== 'admin') {
      await pool.execute(
        'UPDATE users SET wallet_balance = wallet_balance - 10 WHERE id = ?', [decoded.id]
      );
    }

    res.status(201).json({ message: 'Ad posted successfully' });
  } catch (err) {
    console.error('POST /ads error:', err);
    res.status(500).json({ error: 'Failed to post ad' });
  }
});

// ─── PUT edit ad ──────────────────────────────────────────────────────────────
router.put('/:id', (req, _res, next) => {
  // Authenticate BEFORE multer uploads anything to Cloudinary
  try {
    req.decodedUser = decodeToken(req);
    next();
  } catch (err) {
    next(err);
  }
}, upload.array('photos', 4), async (req, res) => {
  try {
    const decoded = req.decodedUser;
    const { id } = req.params;
    const { title, description, age, city_id, existing_photos } = req.body;

    // Validate ownership
    const [rows] = await pool.execute('SELECT user_id FROM ads WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Ad not found' });
    if (!isSameUser(rows[0].user_id, decoded.id) && decoded.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to edit this ad' });
    }

    // Parse kept existing photos
    let keptPhotos = [];
    if (existing_photos) {
      try {
        const parsed = JSON.parse(existing_photos);
        keptPhotos = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        keptPhotos = existing_photos ? [existing_photos] : [];
      }
    }

    // New uploads from Cloudinary
    const newPhotoUrls = req.files?.length
      ? req.files.map(getUploadUrl).filter(Boolean)
      : [];

    const allPhotos = [...keptPhotos, ...newPhotoUrls].slice(0, 4);

    if (allPhotos.length === 0) {
      return res.status(400).json({ error: 'At least one photo is required' });
    }

    await pool.execute(
      'UPDATE ads SET title = ?, description = ?, age = ?, city_id = ?, photo_url = ? WHERE id = ?',
      [title, description || '', age || null, city_id, JSON.stringify(allPhotos), id]
    );

    res.json({ message: 'Ad updated successfully' });
  } catch (err) {
    console.error('PUT /ads/:id error:', err);
    res.status(500).json({ error: 'Failed to update ad' });
  }
});

// ─── DELETE ad ────────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const [rows] = await pool.execute('SELECT user_id FROM ads WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Ad not found' });
    if (!isSameUser(rows[0].user_id, decoded.id) && decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await pool.execute('DELETE FROM ads WHERE id = ?', [req.params.id]);
    res.json({ message: 'Ad deleted successfully' });
  } catch (err) {
    console.error('DELETE /ads/:id error:', err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Failed to delete ad' });
  }
});

// ─── PUT bump ad ──────────────────────────────────────────────────────────────
router.put('/:id/bump', async (req, res) => {
  try {
    const decoded = decodeToken(req);
    const [rows] = await pool.execute('SELECT user_id FROM ads WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Ad not found' });
    if (!isSameUser(rows[0].user_id, decoded.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const [users] = await pool.execute(
      'SELECT wallet_balance FROM users WHERE id = ?', [decoded.id]
    );
    if (Number(users[0].wallet_balance) < 5) {
      return res.status(400).json({ error: 'Insufficient balance to bump. Please deposit funds.' });
    }
    await pool.execute('UPDATE users SET wallet_balance = wallet_balance - 5 WHERE id = ?', [decoded.id]);
    await pool.execute('UPDATE ads SET created_at = CURRENT_TIMESTAMP WHERE id = ?', [req.params.id]);
    res.json({ message: 'Ad bumped successfully!' });
  } catch (err) {
    console.error('PUT /ads/:id/bump error:', err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Failed to bump ad' });
  }
});

export default router;
