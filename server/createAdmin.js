import bcrypt from 'bcrypt';
import pool from './db.js';

const email = 'admin@escortprovider.com';
const password = 'admin_password_123'; // CHANGE THIS IMMEDIATELY
const alias = 'Super Admin';

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, alias, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, alias, 'admin']
    );
    console.log('✅ Admin created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('IMPORTANT: Log in and change your password immediately!');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log('❌ Admin already exists.');
    } else {
      console.error('Error creating admin:', err);
    }
  } finally {
    process.exit(0);
  }
}

createAdmin();
