import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig = process.env.DATABASE_URL
  ? { uri: process.env.DATABASE_URL }
  : {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  };

const pool = mysql.createPool({
  ...poolConfig,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  // Disable strong SSL enforcement for local/shared dev environments unless specified
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false
});

export default pool;
