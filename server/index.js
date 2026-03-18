import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adRoutes from './routes/ads.js';
import locationRoutes from './routes/locations.js';
import adminRoutes from './routes/admin.js';
import depositRoutes from './routes/deposits.js';

import fs from 'fs';

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

app.get('/', (req, res) => {
  res.send('EscortProvider API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
