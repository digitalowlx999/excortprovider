import pool from './db.js';

async function check() {
  try {
    const [users] = await pool.query('SELECT id, email, role FROM users');
    console.log('USERS_FOUND:', JSON.stringify(users));
    
    const [counts] = await pool.query('SELECT (SELECT COUNT(*) FROM states) as state_count, (SELECT COUNT(*) FROM cities) as city_count, (SELECT COUNT(*) FROM ads) as ad_count');
    console.log('COUNTS:', JSON.stringify(counts[0]));
    
  } catch (err) {
    console.error('DB_ERROR:', err);
  } finally {
    process.exit(0);
  }
}

check();
