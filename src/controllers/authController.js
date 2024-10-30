const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Demo user (replace with database in production)
const demoUser = {
  username: 'admin',
  password: process.env.PASSWORD,
};

router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('username', username);
    console.log('password', password);

    // Debug logging
    console.log('Login attempt:', { username });

    // Validate input
    if (!username || !password) {
      req.flash('error', 'Please provide both username and password');
      return res.redirect('/auth/login');
    }

    // Check username
    if (username !== demoUser.username) {
      console.log('Username mismatch');
      req.flash('error', 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, demoUser.password);
    console.log('Password check:', { isValid: isValidPassword });

    if (!isValidPassword) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    // Set user session
    req.session.user = {
      username: demoUser.username,
    };

    // Debug logging
    console.log('Login successful:', { username });

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'An error occurred during login');
    res.redirect('/auth/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;
