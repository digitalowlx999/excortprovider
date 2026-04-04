import pool from './db.js';
try {
  const [rows] = await pool.execute("SELECT id, email, role FROM users WHERE role = 'admin'");
  console.log('Admin users:', rows);
} catch (err) {
  console.error('Error fetching admins:', err);
} finally {
  process.exit();
}
