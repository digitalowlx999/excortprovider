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

const allowedOrigins = [
  'https://excortprovider.com',
  'https://www.excortprovider.com',
  'http://localhost:5173',
  'http://localhost:4173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
