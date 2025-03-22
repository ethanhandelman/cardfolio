const { ObjectId } = require('mongodb');
const { getUsersCollection } = require('../db/config');
const { getCardImageUrl, deleteCardImage } = require('../utils/imageUtils');

/**
 * Add a card to a user's collection
 * @param {string} userId - User ID
 * @param {Object} cardData - Card data
 * @param {string} imageFilename - Uploaded image filename
 * @returns {Promise<Object>} - Newly created card
 */
async function addCard(userId, cardData, imageFilename) {
  const usersCollection = getUsersCollection();
  
  // Create card object with image URL
  const newCard = {
    id: new ObjectId().toString(), // Generate unique ID for the card
    title: cardData.title,
    value: cardData.value,
    funFact: cardData.funFact,
    image: getCardImageUrl(imageFilename), // Convert filename to URL
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Add card to user's collection
  await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    { 
      $push: { cards: newCard },
      $set: { updatedAt: new Date() }
    }
  );
  
  return newCard;
}

/**
 * Get all cards for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of user's cards
 */
async function getUserCards(userId) {
  const usersCollection = getUsersCollection();
  
  const user = await usersCollection.findOne(
    { _id: new ObjectId(userId) },
    { projection: { cards: 1 } }
  );
  
  return user?.cards || [];
}

/**
 * Update a card in a user's collection
 * @param {string} userId - User ID
 * @param {string} cardId - Card ID
 * @param {Object} updateData - Updated card data
 * @param {string} newImageFilename - New image filename (optional)
 * @returns {Promise<boolean>} - Success status
 */
async function updateCard(userId, cardId, updateData, newImageFilename = null) {
  const usersCollection = getUsersCollection();
  
  // Find the user and get the current card data
  const user = await usersCollection.findOne(
    { _id: new ObjectId(userId) },
    { projection: { 'cards': { $elemMatch: { id: cardId } } } }
  );
  
  if (!user || !user.cards || user.cards.length === 0) {
    throw new Error('Card not found');
  }
  
  const currentCard = user.cards[0];
  
  // Build update object
  const updateObject = {
    'cards.$.title': updateData.title || currentCard.title,
    'cards.$.value': updateData.value || currentCard.value,
    'cards.$.funFact': updateData.funFact || currentCard.funFact,
    'cards.$.updatedAt': new Date()
  };
  
  // If new image provided, update image path
  if (newImageFilename) {
    // Extract the old filename from the URL
    const oldImagePath = currentCard.image;
    const oldFilename = oldImagePath.split('/').pop();
    
    // Delete old image if it exists
    await deleteCardImage(oldFilename);
    
    // Update image path
    updateObject['cards.$.image'] = getCardImageUrl(newImageFilename);
  }
  
  // Update the card
  const result = await usersCollection.updateOne(
    { 
      _id: new ObjectId(userId),
      'cards.id': cardId
    },
    { 
      $set: updateObject,
      $set: { updatedAt: new Date() }
    }
  );
  
  return result.modifiedCount > 0;
}

/**
 * Delete a card from a user's collection
 * @param {string} userId - User ID
 * @param {string} cardId - Card ID
 * @returns {Promise<boolean>} - Success status
 */
async function deleteCard(userId, cardId) {
  const usersCollection = getUsersCollection();
  
  // Find the user and get the card data (to get the image path)
  const user = await usersCollection.findOne(
    { _id: new ObjectId(userId) },
    { projection: { 'cards': { $elemMatch: { id: cardId } } } }
  );
  
  if (!user || !user.cards || user.cards.length === 0) {
    throw new Error('Card not found');
  }
  
  const card = user.cards[0];
  
  // Extract the filename from the URL
  const imagePath = card.image;
  const filename = imagePath.split('/').pop();
  
  // Delete the image file
  await deleteCardImage(filename);
  
  // Remove the card from the user's collection
  const result = await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    { 
      $pull: { cards: { id: cardId } },
      $set: { updatedAt: new Date() }
    }
  );
  
  return result.modifiedCount > 0;
}

module.exports = {
  addCard,
  getUserCards,
  updateCard,
  deleteCard
};