import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import authRoutes from './routes/auth.js';
import adRoutes from './routes/ads.js';
import locationRoutes from './routes/locations.js';
import adminRoutes from './routes/admin.js';
import depositRoutes from './routes/deposits.js';
import seedRoutes from './routes/seed.js';
import pool from './db.js';
import { runSeed } from './seed_dummy_ads.js';

dotenv.config();

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/seed-dummy', seedRoutes);

// --- SEEDING & ADMIN SETUP ---
app.get('/api/setup-admin', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.send('Please provide email: /api/setup-admin?email=your@email.com');
  try {
    await pool.execute('UPDATE users SET role = "admin" WHERE email = ?', [email]);
    res.send(`SUCCESS: ${email} is now an ADMIN. Please LOG OUT and LOG IN again on the website.`);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

app.get('/api/mass-seed', async (req, res) => {
  try {
    await runSeed();
    res.send('SUCCESS: 90 profiles seeded successfully! Refresh your home page now.');
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

app.get('/', (req, res) => {
  res.send('EscortProvider API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
