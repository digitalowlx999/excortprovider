import pool from './server/db.js';

async function run() {
  try {
    console.log("Creating seed_images table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seed_images (
          id INT AUTO_INCREMENT PRIMARY KEY,
          category VARCHAR(50) NOT NULL,
          url VARCHAR(500) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table created successfully.");
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

run();
