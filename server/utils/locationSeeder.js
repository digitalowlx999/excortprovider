import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runLocationSeed() {
  console.log("🚀 Starting Remote Mega Location Seed...");
  const results = {
      success: false,
      statementsExecuted: 0,
      totalStatements: 0,
      errors: []
  };
  
  try {
    // 1. Read the SQL file
    // Note: __dirname is server/utils, so we need to go up one to server/
    const sqlPath = path.join(__dirname, '..', 'backups', 'MEGA_LOCATION_FIX.sql');
    let sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // 2. Clean up SQL
    sqlContent = sqlContent.replace(/USE\s+\w+;/gi, '-- Using DB from .env');
    
    // Replace INSERT INTO with INSERT IGNORE INTO for safe merging
    sqlContent = sqlContent.replace(/INSERT INTO/gi, 'INSERT IGNORE INTO');
    
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => {
          if (!s || s.length === 0 || s.startsWith('--')) return false;
          // SKIP TRUNCATE statements to avoid deleting existing data
          if (s.toUpperCase().startsWith('TRUNCATE')) return false;
          return true;
      });

    results.totalStatements = statements.length;

    // 3. Disable foreign key checks
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');

    // 4. Execute statements
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await pool.query(stmt);
        results.statementsExecuted++;
      } catch (err) {
        results.errors.push(`Error in statement ${i}: ${err.message}`);
      }
    }

    // 5. Re-enable foreign key checks
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    results.success = true;
    return results;
  } catch (err) {
    console.error("💥 Remote Seeding Error:", err);
    results.success = false;
    results.errors.push(err.message);
    return results;
  }
}
