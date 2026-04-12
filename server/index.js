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

dotenv.config();

// Ensure uploads directory exists (for local dev fallback)
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://excortprovider.com',
  'https://www.excortprovider.com',
  'http://localhost:5173',
  'http://localhost:4173',
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/seed-dummy', seedRoutes);

app.get('/', (req, res) => {
  res.send('EscortProvider API is running...');
});

// Global JSON error handler — catches multer errors, cloudinary errors,
// and any unhandled middleware errors so the client always gets JSON back
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);

  // Multer file size / field limit errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 5MB per image.' });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ error: 'Too many files. Maximum 4 photos allowed.' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected file field.' });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

// Run DB migrations on startup
async function runMigrations() {
  const migrations = [
    // Widen photo_url to TEXT to support full Cloudinary URLs in JSON arrays
    'ALTER TABLE ads MODIFY COLUMN photo_url TEXT',
    // Add contact fields if they don't already exist
    'ALTER TABLE ads ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT NULL',
    'ALTER TABLE ads ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(50) DEFAULT NULL',
    'ALTER TABLE ads ADD COLUMN IF NOT EXISTS telegram VARCHAR(100) DEFAULT NULL',
    'ALTER TABLE ads ADD COLUMN IF NOT EXISTS instagram VARCHAR(100) DEFAULT NULL',
  ];

  for (const sql of migrations) {
    try {
      await pool.execute(sql);
      console.log('Migration OK:', sql.slice(0, 60));
    } catch (err) {
      // Errors like "Duplicate column" are expected on re-runs — safe to ignore
      console.log('Migration skipped:', err.code || err.message);
    }
  }
}

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await runMigrations();
});
