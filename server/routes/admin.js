import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// Auth Middleware (Admin only)
const isAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all users (Admin Only)
router.get('/users', isAdmin, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, email, alias, role, wallet_balance, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (err) {
    console.error("Fetch admin users error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Settings
router.get('/settings', async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT key_name, key_value FROM settings');
    const settingsObj = {};
    settings.forEach(s => settingsObj[s.key_name] = s.key_value);
    res.json(settingsObj);
  } catch (err) {
    console.error("Fetch settings error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Settings (Admin Only)
router.put('/settings', isAdmin, async (req, res) => {
  const allowedKeys = [
    'wallet_address_btc', 'qr_code_url_btc',
    'wallet_address_eth', 'qr_code_url_eth',
    'wallet_address_usdt', 'qr_code_url_usdt',
    'wallet_address_ltc', 'qr_code_url_ltc'
  ];
  
  // Map legacy keys to BTC for backwards compatibility
  if (req.body.wallet_address !== undefined && req.body.wallet_address_btc === undefined) {
    req.body.wallet_address_btc = req.body.wallet_address;
  }
  if (req.body.qr_code_url !== undefined && req.body.qr_code_url_btc === undefined) {
    req.body.qr_code_url_btc = req.body.qr_code_url;
  }

  try {
    for (const key of allowedKeys) {
      if (req.body[key] !== undefined) {
        const [rows] = await pool.query('SELECT 1 FROM settings WHERE key_name = ?', [key]);
        if (rows.length > 0) {
          await pool.execute('UPDATE settings SET key_value = ? WHERE key_name = ?', [req.body[key], key]);
        } else {
          await pool.execute('INSERT INTO settings (key_name, key_value) VALUES (?, ?)', [key, req.body[key]]);
        }
      }
    }
    res.json({ message: 'Settings updated' });
  } catch (err) {
    console.error("Update settings error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete User (Admin Only)
router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    // Prevent admin from deleting themselves (optional but recommended)
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (String(decoded.id) === String(req.params.id)) {
      return res.status(400).json({ error: 'You cannot delete your own admin account.' });
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create City
router.post('/cities', isAdmin, async (req, res) => {
  const { name, state_code } = req.body;
  if (!name || !state_code) return res.status(400).json({ error: 'Name and State Code are required' });
  
  try {
    // Find state id
    const [states] = await pool.execute('SELECT id FROM states WHERE code = ?', [state_code]);
    if (states.length === 0) return res.status(404).json({ error: 'State code not found in database. Please use a valid US state code (e.g. CA, NY).' });
    
    const slug = name.toLowerCase().replace(/ /g, '-');
    await pool.execute(
      'INSERT INTO cities (name, state_id, slug) VALUES (?, ?, ?)',
      [name, states[0].id, slug]
    );
    res.status(201).json({ message: 'City added successfully' });
  } catch (err) {
    console.error("Add city error:", err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'This city already exists.' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete City
router.delete('/cities/:id', isAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM cities WHERE id = ?', [req.params.id]);
    res.json({ message: 'City deleted successfully' });
  } catch (err) {
    console.error("Delete city error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- SEED IMAGES MANAGEMENT ---
// Get all seed images
router.get('/seed-images', isAdmin, async (req, res) => {
  try {
    const [images] = await pool.query('SELECT * FROM seed_images ORDER BY category, id DESC');
    res.json(images);
  } catch (err) {
    console.error("Fetch seed images error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new seed image
router.post('/seed-images', isAdmin, async (req, res) => {
  const { category, url } = req.body;
  
  if (!category || !url) {
    return res.status(400).json({ error: 'Category and URL are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO seed_images (category, url) VALUES (?, ?)',
      [category.toLowerCase(), url]
    );
    res.status(201).json({ id: result.insertId, category: category.toLowerCase(), url });
  } catch (err) {
    console.error("Add seed image error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a seed image
router.delete('/seed-images/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM seed_images WHERE id = ?', [id]);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error("Delete seed image error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
