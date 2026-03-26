import express from 'express';
import { runSeed } from '../seed_dummy_ads.js';
import { isAdmin } from '../middleware/auth.js';
import { runLocationSeed } from '../utils/locationSeeder.js';

const router = express.Router();

// Trigger dummy ads seeding (Admin Only)
router.get('/', isAdmin, async (req, res) => {
  try {
    console.log('--- REMOTE DUMMY ADS SEEDING TRIGGERED ---');
    await runSeed();
    res.json({ message: 'Seeding completed successfully! Check your home page.' });
  } catch (err) {
    console.error('Remote seeding error:', err);
    res.status(500).json({ error: 'Seeding failed. Check server logs.' });
  }
});

// Trigger location seeding (Admin Only)
router.get('/locations', isAdmin, async (req, res) => {
  try {
    console.log('--- REMOTE LOCATION SEEDING TRIGGERED ---');
    const results = await runLocationSeed();
    if (results.success) {
      res.json({ 
        message: 'Location seeding completed successfully!',
        details: {
          total: results.totalStatements,
          executed: results.statementsExecuted,
          errors: results.errors.length
        }
      });
    } else {
      res.status(500).json({ error: 'Location seeding failed', errors: results.errors });
    }
  } catch (err) {
    console.error('Remote location seeding error:', err);
    res.status(500).json({ error: 'Internal server error during seeding' });
  }
});

// Diagnostic route to find the cause of 500 errors (Temporarily unprotected for debugging)
router.get('/debug-error', async (req, res) => {
  try {
    const query = 'SELECT a.*, c.name as city_name, c.slug as city_slug, s.name as state_name FROM ads a JOIN cities c ON a.city_id = c.id JOIN states s ON c.state_id = s.id LIMIT 1';
    const [rows] = await pool.execute(query);
    res.json({ status: 'Database Query OK', rowCount: rows.length });
  } catch (err) {
    res.status(500).json({ 
      error: 'Database Query Failed', 
      message: err.message, 
      code: err.code,
      stack: err.stack
    });
  }
});

export default router;
