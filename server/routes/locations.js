import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all states
router.get('/states', async (req, res) => {
  try {
    const [states] = await pool.execute('SELECT * FROM states ORDER BY name ASC');
    res.json(states);
  } catch (err) {
    console.error("Fetch states error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get cities in a state
router.get('/cities/:stateId', async (req, res) => {
  const { stateId } = req.params;
  try {
    const [cities] = await pool.execute('SELECT * FROM cities WHERE state_id = ? ORDER BY name ASC', [stateId]);
    res.json(cities);
  } catch (err) {
    console.error("Fetch cities error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all cities (for browse or search)
router.get('/cities', async (req, res) => {
  try {
    const [cities] = await pool.execute(`
      SELECT c.*, s.name as state_name, s.code as state_code 
      FROM cities c 
      JOIN states s ON c.state_id = s.id 
      ORDER BY c.name ASC
    `);
    res.json(cities);
  } catch (err) {
    console.error("Fetch all cities error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
