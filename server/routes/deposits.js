import express from 'express';
import pool from '../db.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// User: Submit a deposit for verification
router.post('/', verifyToken, async (req, res) => {
  const { amount, currency, transaction_hash } = req.body;
  if (!transaction_hash) return res.status(400).json({ error: 'Transaction hash is required' });
  const parsedAmount = parseFloat(amount);
  if (!parsedAmount || parsedAmount < 100) {
    return res.status(400).json({ error: 'Minimum deposit amount is $100' });
  }
  try {
    await pool.execute(
      'INSERT INTO deposits (user_id, amount, currency, transaction_hash, status) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, parsedAmount, currency || 'BTC', transaction_hash, 'pending']
    );
    res.status(201).json({ message: 'Deposit submitted for verification' });
  } catch (err) {
    console.error('Deposit submission error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User: Get own deposits
router.get('/my', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM deposits WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch my deposits error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get all deposits
router.get('/', isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT d.*, u.email, u.alias 
      FROM deposits d 
      JOIN users u ON d.user_id = u.id 
      ORDER BY d.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Fetch deposits error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Approve a deposit (credits user wallet)
router.put('/:id/approve', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body; // Admin specifies the verified USD amount
  
  if (amount === undefined || isNaN(parseFloat(amount))) {
    return res.status(400).json({ error: 'Valid amount is required' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM deposits WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Deposit not found' });
    
    const deposit = rows[0];
    if (deposit.status === 'approved') {
      return res.status(400).json({ error: 'This deposit has already been approved' });
    }

    const creditAmount = parseFloat(amount);

    // Update deposit status
    await pool.execute(
      'UPDATE deposits SET status = ?, amount = ? WHERE id = ?',
      ['approved', creditAmount, id]
    );

    // Credit user wallet
    await pool.execute(
      'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
      [creditAmount, deposit.user_id]
    );

    res.json({ message: `Deposit approved and $${creditAmount.toFixed(2)} credited to user wallet` });
  } catch (err) {
    console.error('Approve deposit error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Reject a deposit
router.put('/:id/reject', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('UPDATE deposits SET status = ? WHERE id = ?', ['rejected', id]);
    res.json({ message: 'Deposit rejected' });
  } catch (err) {
    console.error('Reject deposit error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
