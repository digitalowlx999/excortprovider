import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'escort_provider_ads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 1600, crop: 'limit', quality: 'auto' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Auth helper
function getUserFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error('No token');
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

// GET all ads (with filtering)
router.get('/', async (req, res) => {
  const { city, featured } = req.query;
  let query = 'SELECT a.*, c.name as city_name, c.slug as city_slug, s.name as state_name, s.code as state_code FROM ads a LEFT JOIN cities c ON a.city_id = c.id LEFT JOIN states s ON c.state_id = s.id';
  const params = [];

  if (city || featured) {
    query += ' WHERE';
    if (city) {
      query += ' c.slug = ?';
      params.push(city);
    }
    if (featured) {
      if (city) query += ' AND';
      query += ' a.is_featured = 1';
    }
  }

  const { sort, limit } = req.query;
  if (sort === 'random') {
    query += ' ORDER BY RAND()';
  } else {
    query += ' ORDER BY a.created_at DESC';
  }

  if (limit) {
    query += ' LIMIT ?';
    params.push(parseInt(limit));
  }

  try {
    const [ads] = await pool.query(query, params);
    res.json(ads);
  } catch (err) {
    console.error('Fetch ads error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single ad by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute(
      'SELECT a.*, c.name as city_name, c.slug as city_slug, s.name as state_name, s.code as state_code FROM ads a LEFT JOIN cities c ON a.city_id = c.id LEFT JOIN states s ON c.state_id = s.id WHERE a.id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Ad not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Fetch ad error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new ad
router.post('/', upload.array('photos', 4), async (req, res) => {
  try {
    const decoded = getUserFromToken(req);
    const { title, description, age, city_id } = req.body;

    if (!title || !city_id) {
      return res.status(400).json({ error: 'Title and city are required' });
    }

    // Build photo URL array from Cloudinary responses
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = req.files.map(file => file.path); // Cloudinary returns secure_url as file.path
    } else if (req.body.photo_url) {
      photoUrls = [req.body.photo_url];
    }

    const storedPhotoUrl = JSON.stringify(photoUrls);

    // Check balance — skip for admin
    if (decoded.role !== 'admin') {
      const [users] = await pool.execute('SELECT wallet_balance FROM users WHERE id = ?', [decoded.id]);
      if (!users.length || users[0].wallet_balance < 10) {
        return res.status(400).json({ error: 'Insufficient balance. You need at least $10 to post an ad.' });
      }
    }

    await pool.execute(
      'INSERT INTO ads (user_id, title, description, age, city_id, photo_url) VALUES (?, ?, ?, ?, ?, ?)',
      [decoded.id, title, description, age, city_id, storedPhotoUrl]
    );

    if (decoded.role !== 'admin') {
      await pool.execute('UPDATE users SET wallet_balance = wallet_balance - 10 WHERE id = ?', [decoded.id]);
    }

    res.status(201).json({ message: 'Ad posted successfully' });
  } catch (err) {
    console.error('Post ad error:', err);
    res.status(401).json({ error: 'Invalid token or server error' });
  }
});

// PUT edit ad
router.put('/:id', upload.array('photos', 4), async (req, res) => {
  try {
    const decoded = getUserFromToken(req);
    const { id } = req.params;
    const { title, description, age, city_id, existing_photos } = req.body;

    // Check ownership
    const [rows] = await pool.execute('SELECT * FROM ads WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Ad not found' });
    if (rows[0].user_id !== decoded.id && decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Merge kept existing photos with any newly uploaded ones
    let keptPhotos = [];
    if (existing_photos) {
      try {
        keptPhotos = JSON.parse(existing_photos);
      } catch {
        keptPhotos = [existing_photos];
      }
    }

    let newPhotoUrls = [];
    if (req.files && req.files.length > 0) {
      newPhotoUrls = req.files.map(file => file.path);
    }

    const allPhotos = [...keptPhotos, ...newPhotoUrls].slice(0, 4);
    const storedPhotoUrl = JSON.stringify(allPhotos);

    await pool.execute(
      'UPDATE ads SET title = ?, description = ?, age = ?, city_id = ?, photo_url = ? WHERE id = ?',
      [title, description, age, city_id, storedPhotoUrl, id]
    );

    res.json({ message: 'Ad updated successfully' });
  } catch (err) {
    console.error('Edit ad error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE ad
router.delete('/:id', async (req, res) => {
  try {
    const decoded = getUserFromToken(req);
    const { id } = req.params;

    const [rows] = await pool.execute('SELECT * FROM ads WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Ad not found' });

    if (rows[0].user_id !== decoded.id && decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await pool.execute('DELETE FROM ads WHERE id = ?', [id]);
    res.json({ message: 'Ad deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error or invalid token' });
  }
});

// PUT bump ad to top
router.put('/:id/bump', async (req, res) => {
  try {
    const decoded = getUserFromToken(req);
    const { id } = req.params;

    const [rows] = await pool.execute('SELECT * FROM ads WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Ad not found' });
    if (rows[0].user_id !== decoded.id) return res.status(403).json({ error: 'Forbidden' });

    const [users] = await pool.execute('SELECT wallet_balance FROM users WHERE id = ?', [decoded.id]);
    if (users[0].wallet_balance < 5) {
      return res.status(400).json({ error: 'Insufficient balance to bump ad. Please deposit funds.' });
    }

    await pool.execute('UPDATE users SET wallet_balance = wallet_balance - 5 WHERE id = ?', [decoded.id]);
    await pool.execute('UPDATE ads SET created_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);

    res.json({ message: 'Ad bumped successfully!' });
  } catch (err) {
    console.error('Bump ad error:', err);
    res.status(500).json({ error: 'Failed to bump ad. Please try again.' });
  }
});

export default router;
