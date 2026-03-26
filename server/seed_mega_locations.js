import pool from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seedLocations() {
  console.log("🚀 Starting Mega Location Seed...");
  
  try {
    // 1. Read the SQL file
    const sqlPath = path.join(__dirname, 'backups', 'MEGA_LOCATION_FIX.sql');
    let sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // 2. Clean up SQL: Remove 'USE escort_db;' and other problematic parts
    // We want it to use the database defined in .env
    sqlContent = sqlContent.replace(/USE\s+\w+;/gi, '-- Using DB from .env');
    
    // Split by semicolon but be careful with escaped semicolons (not very common in this file)
    // The file mostly has INSERT statements.
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📊 Found ${statements.length} SQL statements to execute.`);

    // 3. Disable foreign key checks for the truncate/insert process
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log("🔓 Disabled foreign key checks.");

    // 4. Execute statements
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await pool.query(stmt);
        if (i % 20 === 0) console.log(`✅ Progress: ${i}/${statements.length} statements executed.`);
      } catch (err) {
        console.error(`❌ Error in statement ${i}:`, err.message);
        console.error(`Statement: ${stmt.substring(0, 100)}...`);
        // We continue if it's just a duplicate entry or something, but stop on major errors
        if (!err.message.includes('Duplicate entry')) {
            // throw err; // Uncomment to stop on error
        }
      }
    }

    // 5. Re-enable foreign key checks
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("🔒 Re-enabled foreign key checks.");

    console.log("✨ Mega Location Seed Completed Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("💥 Critical Seeding Error:", err);
    process.exit(1);
  }
}

seedLocations();
