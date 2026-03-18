import pool from './server/db.js';

async function check() {
  try {
    const [states] = await pool.query('DESCRIBE states');
    console.log('STATES:', JSON.stringify(states, null, 2));
    const [cities] = await pool.query('DESCRIBE cities');
    console.log('CITIES:', JSON.stringify(cities, null, 2));
    
    const [sampleStates] = await pool.query('SELECT * FROM states LIMIT 5');
    console.log('SAMPLE STATES:', JSON.stringify(sampleStates, null, 2));
    
    const [sampleCities] = await pool.query('SELECT * FROM cities LIMIT 5');
    console.log('SAMPLE CITIES:', JSON.stringify(sampleCities, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

check();
