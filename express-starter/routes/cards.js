const express = require('express');
const { addCard, getUserCards, updateCard, deleteCard } = require('../services/cardService');
const authMiddleware = require('../middleware/auth');
const { uploadCardImage } = require('../middleware/upload');

const router = express.Router();

// All card routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/cards
 * @desc    Get all cards for the authenticated user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const cards = await getUserCards(req.user.id);
    
    res.status(200).json({
      success: true,
      count: cards.length,
      cards
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cards'
    });
  }
});

/**
 * @route   POST /api/cards
 * @desc    Add a new card with image upload
 * @access  Private
 */
router.post('/', uploadCardImage.single('image'), async (req, res) => {
  try {
    // Ensure image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image for the card'
      });
    }
    
    const { title, value, funFact } = req.body;
    
    // Validate required fields
    if (!title || !value) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and value for the card'
      });
    }
    
    // Add card to user's collection
    const newCard = await addCard(
      req.user.id,
      { title, value, funFact },
      req.file.filename
    );
    
    res.status(201).json({
      success: true,
      message: 'Card added successfully',
      card: newCard
    });
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding card'
    });
  }
});

/**
 * @route   PUT /api/cards/:cardId
 * @desc    Update a card (with optional image update)
 * @access  Private
 */
router.put('/:cardId', uploadCardImage.single('image'), async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, value, funFact } = req.body;
    
    // Update card data
    const success = await updateCard(
      req.user.id,
      cardId,
      { title, value, funFact },
      req.file?.filename // Optional new image
    );
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Card not found or update failed'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Card updated successfully'
    });
  } catch (error) {
    console.error('Error updating card:', error);
    
    if (error.message === 'Card not found') {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating card'
    });
  }
});

/**
 * @route   DELETE /api/cards/:cardId
 * @desc    Delete a card
 * @access  Private
 */
router.delete('/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    
    // Delete card
    const success = await deleteCard(req.user.id, cardId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Card not found or delete failed'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Card deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting card:', error);
    
    if (error.message === 'Card not found') {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting card'
    });
  }
});

module.exports = router;