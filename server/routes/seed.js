import express from 'express';
import { runSeed } from '../seed_dummy_ads.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Trigger seeding (Admin Only)
router.get('/', isAdmin, async (req, res) => {
  try {
    console.log('--- REMOTE SEEDING TRIGGERED ---');
    await runSeed();
    res.json({ message: 'Seeding completed successfully! Check your home page.' });
  } catch (err) {
    console.error('Remote seeding error:', err);
    res.status(500).json({ error: 'Seeding failed. Check server logs.' });
  }
});

export default router;
