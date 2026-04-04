import pool from './db.js';

const email = 'aliciaweb324@gmail.com';
const newBalance = 100.00;

async function updateBalance() {
  try {
    // 1. Check current balance
    const [users] = await pool.execute('SELECT id, email, wallet_balance FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      console.log(`User with email ${email} not found.`);
      return;
    }

    const user = users[0];
    console.log(`Current state for ${email}: ID=${user.id}, Balance=${user.wallet_balance}`);

    // 2. Perform Update
    await pool.execute('UPDATE users SET wallet_balance = ? WHERE id = ?', [newBalance, user.id]);
    console.log(`Successfully updated balance for ${email} to $${newBalance}`);

    // 3. Verify
    const [updatedUser] = await pool.execute('SELECT wallet_balance FROM users WHERE id = ?', [user.id]);
    console.log(`Verified balance: $${updatedUser[0].wallet_balance}`);

  } catch (err) {
    console.error('Error updating balance:', err);
  } finally {
    process.exit();
  }
}

updateBalance();
