// API URL - change this to match your backend URL
const API_URL = 'http://localhost:3000';

/**
 * Get auth header with token
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

/**
 * Get all cards for the current user
 */
export const getUserCards = async () => {
  try {
    const response = await fetch(`${API_URL}/api/cards`, {
      method: 'GET',
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch cards');
    }
    
    const data = await response.json();
    return data.cards;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

/**
 * Add a new card with image upload
 */
export const addCard = async (cardData, imageFile) => {
  try {
    // Create form data for file upload
    const formData = new FormData();
    formData.append('title', cardData.title);
    formData.append('value', cardData.value);
    formData.append('funFact', cardData.funFact);
    formData.append('image', imageFile);
    
    const response = await fetch(`${API_URL}/api/cards`, {
      method: 'POST',
      headers: {
        ...getAuthHeader()
        // Note: Don't set Content-Type with FormData,
        // the browser will set it with the correct boundary
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add card');
    }
    
    const data = await response.json();
    return data.card;
  } catch (error) {
    console.error('Error adding card:', error);
    throw error;
  }
};

/**
 * Update an existing card
 */
export const updateCard = async (cardId, cardData, imageFile = null) => {
  try {
    // Create form data for possible file upload
    const formData = new FormData();
    formData.append('title', cardData.title);
    formData.append('value', cardData.value);
    formData.append('funFact', cardData.funFact);
    
    // Only append image if a new one is provided
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await fetch(`${API_URL}/api/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader()
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update card');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
};

/**
 * Delete a card
 */
export const deleteCard = async (cardId) => {
  try {
    const response = await fetch(`${API_URL}/api/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete card');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};