import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// Get all ads (with filtering)
router.get('/', async (req, res) => {
  const { city, featured } = req.query;
  let query = 'SELECT a.*, c.name as city_name, c.slug as city_slug, s.name as state_name FROM ads a LEFT JOIN cities c ON a.city_id = c.id LEFT JOIN states s ON c.state_id = s.id';
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
    const [ads] = await pool.execute(query, params);
    res.json(ads);
  } catch (err) {
    console.error("Fetch ads error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single ad by ID
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
    console.error("Fetch ads error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

import multer from 'multer';
import path from 'path';

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists or gets created
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Post Ad
router.post('/', upload.array('photos', 4), async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { title, description, age, city_id } = req.body;
    
    // Process uploaded files
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.body.photo_url) {
      // Fallback for older clients sending string URL
      photoUrls = [req.body.photo_url];
    }
    
    // Store as JSON string or single string (if only 1)
    const storedPhotoUrl = JSON.stringify(photoUrls);

    // Check balance (minimum $10) - Skip for Admin
    if (decoded.role !== 'admin') {
      const [users] = await pool.execute('SELECT wallet_balance FROM users WHERE id = ?', [decoded.id]);
      if (users[0].wallet_balance < 10) return res.status(400).json({ error: 'Insufficient balance' });
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
    console.error("Post ad error:", err);
    res.status(401).json({ error: 'Invalid token or server error' });
  }
});

// Delete Ad
router.delete('/:id', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    // Check if user owns the ad or is admin
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

// Bump Ad to Top
router.put('/:id/bump', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    // Check if user owns the ad
    const [rows] = await pool.execute('SELECT * FROM ads WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Ad not found' });
    
    if (rows[0].user_id !== decoded.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Check balance (cost $5)
    const [users] = await pool.execute('SELECT wallet_balance FROM users WHERE id = ?', [decoded.id]);
    if (users[0].wallet_balance < 5) return res.status(400).json({ error: 'Insufficient balance to bump ad. Please deposit funds.' });

    // Deduct $5 and update created_at time
    await pool.execute('UPDATE users SET wallet_balance = wallet_balance - 5 WHERE id = ?', [decoded.id]);
    await pool.execute('UPDATE ads SET created_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);

    res.json({ message: 'Ad bumped successfully!' });
  } catch (err) {
    console.error('Bump ad error:', err);
    res.status(500).json({ error: 'Failed to bump ad. Please try again.' });
  }
});

export default router;
