import pool from './db.js';

async function verify() {
  console.log("🔍 Starting Database Verification...");
  
  try {
    // 1. Test connection
    const [rows] = await pool.execute("SELECT 1 as connected");
    console.log("✅ Database Connected Successfully.");

    // 2. Test 'viewer' role support
    console.log("⏳ Testing 'viewer' role support...");
    const testEmail = `test_viewer_${Date.now()}@example.com`;
    
    try {
      await pool.execute(
        "INSERT INTO users (email, password, alias, role) VALUES (?, 'password', 'Test', 'viewer')",
        [testEmail]
      );
      console.log("✅ SUCCESS: Database accepted the 'viewer' role.");
      
      // Cleanup
      await pool.execute("DELETE FROM users WHERE email = ?", [testEmail]);
      console.log("🗑️ Test user cleaned up.");
    } catch (err) {
      if (err.code === 'ER_TRUNCATED_WRONG_VALUE' || err.message.includes('Data truncated')) {
        console.error("❌ FAILURE: The 'viewer' role was REJECTED. You still need to run the ALTER TABLE command.");
      } else {
        console.error("❌ Unexpected Error during role test:", err.message);
      }
    }

    // 3. Check city count
    const [cities] = await pool.execute("SELECT COUNT(*) as total FROM cities");
    console.log(`📊 Current City Count: ${cities[0].total}`);

  } catch (err) {
    console.error("❌ Critical Connection Error:", err.message);
  } finally {
    process.exit();
  }
}

verify();
