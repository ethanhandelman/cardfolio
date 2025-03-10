const { getUsersCollection } = require('../db/config');

/**
 * Get user profile by username (public view)
 * Excludes sensitive information like password
 * @param {string} username - Username to look up
 * @returns {Promise<Object>} - User data without sensitive information
 */
async function getUserProfileByUsername(username) {
  const usersCollection = getUsersCollection();
  
  // Find user by username (case insensitive)
  const user = await usersCollection.findOne(
    { username: username.toLowerCase() },
    {
      projection: {
        password: 0, // Exclude password
        email: 0     // Exclude email for privacy
        // All other fields will be included by default
      }
    }
  );
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}

/**
 * Calculate collection statistics for a user
 * @param {Array} cards - User's card collection
 * @returns {Object} - Collection statistics
 */
function calculateCollectionStats(cards = []) {
  // Calculate total value
  const totalValue = cards.reduce((sum, card) => {
    // Extract numeric value from string (remove $ and any commas)
    const value = parseFloat(card.value.replace(/[$,]/g, '')) || 0;
    return sum + value;
  }, 0);
  
  // Format total value
  let formattedValue = '$0';
  if (totalValue >= 1000) {
    formattedValue = `$${(totalValue / 1000).toFixed(1)}k`;
  } else {
    formattedValue = `$${totalValue}`;
  }
  
  return {
    cardCount: cards.length,
    totalValue: formattedValue,
    rawTotalValue: totalValue
  };
}

module.exports = {
  getUserProfileByUsername,
  calculateCollectionStats
};