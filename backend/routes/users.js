const express = require('express');
const { getUserProfileByUsername, calculateCollectionStats } = require('../services/userService');

const router = express.Router();

/**
 * @route   GET /api/users/:username
 * @desc    Get public profile for a user by username
 * @access  Public
 */
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // Validate username
    if (!username || username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }
    
    // Get user profile
    const user = await getUserProfileByUsername(username);
    
    // Calculate collection stats
    const stats = calculateCollectionStats(user.cards);
    
    // Return user profile with stats
    res.status(200).json({
      success: true,
      user: {
        ...user,
        stats
      }
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user profile'
    });
  }
});

module.exports = router;