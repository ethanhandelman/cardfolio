const express = require('express');
const { registerUser, loginUser } = require('../services/authService');

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, location, bio, profileImage } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide username, email and password' 
      });
    }
    
    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }
    
    // Register the user
    const newUser = await registerUser({ 
      username, 
      email, 
      password, 
      name, 
      location, 
      bio, 
      profileImage 
    });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

/**
 * @route   POST /auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide username and password' 
      });
    }
    
    // Login the user
    const { user, token } = await loginUser(username, password);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    if (error.message === 'Invalid username or password') {
      return res.status(401).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

module.exports = router;