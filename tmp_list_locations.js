import pool from './server/db.js';

async function listLocations() {
  try {
    const [cities] = await pool.execute(`
      SELECT c.name as city, s.name as state, s.code 
      FROM cities c 
      JOIN states s ON c.state_id = s.id
    `);
    console.log('--- Current Locations in DB ---');
    console.table(cities);
    process.exit(0);
  } catch (err) {
    console.error('Error listing locations:', err);
    process.exit(1);
  }
}

listLocations();
