import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Resend } from 'resend';
import pool from '../db.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password, alias, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, alias, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, alias, role || 'escort']
    );
    
    const token = jwt.sign({ id: result.insertId, role: role || 'escort' }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: result.insertId, email, alias, role: role || 'escort' } });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'This email is already registered. Please login instead.' });
    }
    res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, alias: user.alias, role: user.role, wallet_balance: user.wallet_balance } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Profile
router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await pool.execute('SELECT id, email, alias, role, wallet_balance FROM users WHERE id = ?', [decoded.id]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(users[0]);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update Profile
router.put('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { alias } = req.body;
    await pool.execute('UPDATE users SET alias = ? WHERE id = ?', [alias, decoded.id]);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Forgot Password (Real Implementation)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  try {
    const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    
    // Security: Always return success message to prevent user enumeration
    if (users.length > 0) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

      // Save token to DB
      await pool.execute(
        'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
        [email, token, expiresAt]
      );

      // Send Email
      const resetLink = `https://excortprovider.com/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
      
      await resend.emails.send({
        from: 'EscortProvider <onboarding@resend.dev>', // You can change this to your domain once verified in Resend
        to: [email],
        subject: 'Password Reset Instructions - EscortProvider',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #ff2d55; text-align: center;">EscortProvider</h2>
            <p>Hello,</p>
            <p>You requested to reset your password. Click the button below to set a new password. This link will expire in 1 hour.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #ff2d55; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888;">&copy; 2024 EscortProvider. All rights reserved.</p>
          </div>
        `,
      });
      console.log(`Password reset email sent to: ${email}`);
    }
    
    res.json({ message: 'If an account exists with this email, you will receive reset instructions shortly.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset Password (Verify Token)
router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;
  
  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Check if token exists and is valid
    const [resets] = await pool.execute(
      'SELECT id FROM password_resets WHERE email = ? AND token = ? AND expires_at > NOW()',
      [email, token]
    );

    if (resets.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token. Please request a new one.' });
    }

    // 2. Hash and Update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
    
    // 3. Cleanup: Delete the used token
    await pool.execute('DELETE FROM password_resets WHERE email = ?', [email]);

    res.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
