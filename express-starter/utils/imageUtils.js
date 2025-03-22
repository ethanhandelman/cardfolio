const fs = require('fs-extra');
const path = require('path');

// Base directory for all uploads
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// Directory for card images
const CARD_IMAGES_DIR = path.join(UPLOAD_DIR, 'cards');

// Ensure directories exist
async function ensureDirectories() {
  await fs.ensureDir(UPLOAD_DIR);
  await fs.ensureDir(CARD_IMAGES_DIR);
}

// Get the full path of a card image
function getCardImagePath(filename) {
  return path.join(CARD_IMAGES_DIR, filename);
}

// Generate a filename for a new card image
function generateCardImageFilename(userId, originalFilename) {
  const extension = path.extname(originalFilename);
  const timestamp = Date.now();
  return `card_${userId}_${timestamp}${extension}`;
}

// Get the public URL for a card image
function getCardImageUrl(filename) {
  return `/uploads/cards/${filename}`;
}

// Delete a card image file
async function deleteCardImage(filename) {
  try {
    const filePath = getCardImagePath(filename);
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting image file:', error);
    return false;
  }
}

module.exports = {
  ensureDirectories,
  getCardImagePath,
  generateCardImageFilename,
  getCardImageUrl,
  deleteCardImage,
  CARD_IMAGES_DIR
};