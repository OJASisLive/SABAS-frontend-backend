const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get stats for parents (users with role='user')
router.get('/stats', async (req, res) => {
  try {
    const total = await User.countDocuments({ role: 'user' });
    const verified = await User.countDocuments({ role: 'user', verified: true });
    const notVerified = total - verified;
    res.json({ total, verified, notVerified });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Optional: Get all users (for consistency, but not needed for dashboard)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
