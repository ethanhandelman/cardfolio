const multer = require('multer');
const path = require('path');
const { getCardImagePath, generateCardImageFilename } = require('../utils/imageUtils');

// Configure storage for card images
const cardImageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Pass null for error, and the destination path
    cb(null, path.dirname(getCardImagePath('temp.jpg')));
  },
  filename: function(req, file, cb) {
    // Generate unique filename based on user ID and timestamp
    const userId = req.user?.id || 'anonymous';
    const filename = generateCardImageFilename(userId, file.originalname);
    cb(null, filename);
  }
});

// File filter to validate image files
const imageFileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create upload middleware for card images
const uploadCardImage = multer({
  storage: cardImageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

module.exports = {
  uploadCardImage
};