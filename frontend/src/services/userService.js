// API URL - change this to match your backend URL
const API_URL = 'http://localhost:3000';

/**
 * Fix image URLs to be absolute
 */
export const getAbsoluteImageUrl = (relativeUrl) => {
  // If the URL already starts with http, it's already absolute
  if (relativeUrl && relativeUrl.startsWith('http')) {
    return relativeUrl;
  }
  
  // If undefined or null, return a placeholder
  if (!relativeUrl) {
    return 'https://randomuser.me/api/portraits/lego/1.jpg';
  }
  
  // Otherwise, prepend the API URL
  return `${API_URL}${relativeUrl}`;
};

/**
 * Get user profile by username
 */
export const getUserProfile = async (username) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${username}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      throw new Error('Failed to fetch user profile');
    }
    
    const data = await response.json();
    
    // Process the user data to fix image URLs
    if (data.user) {
      // Fix profile image
      data.user.profileImage = getAbsoluteImageUrl(data.user.profileImage);
      
      // Fix card images
      if (data.user.cards && Array.isArray(data.user.cards)) {
        data.user.cards = data.user.cards.map(card => ({
          ...card,
          image: getAbsoluteImageUrl(card.image)
        }));
      }
    }
    
    return data.user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};