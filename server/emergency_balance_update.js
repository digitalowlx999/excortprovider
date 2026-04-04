import mysql from 'mysql2/promise';

async function updateBalance() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'escort_provider',
    port: 4000,
    ssl: { rejectUnauthorized: true }
  });

  const email = 'aliciaweb324@gmail.com';
  const newBalance = 100.00;

  try {
    const [users] = await connection.execute('SELECT id, email, wallet_balance FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      console.log(`User ${email} not found.`);
      return;
    }

    const user = users[0];
    console.log(`Current state: ${user.wallet_balance}`);

    await connection.execute('UPDATE users SET wallet_balance = ? WHERE id = ?', [newBalance, user.id]);
    console.log(`Updated successfully to $${newBalance}`);

  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    await connection.end();
  }
}

updateBalance();
