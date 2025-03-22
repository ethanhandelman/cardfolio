const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUsersCollection } = require('../db/config');

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

/**
 * Register a new user
 * @param {Object} userData - User data including username, email, password
 * @returns {Promise<Object>} - Newly created user (without password)
 */
async function registerUser(userData) {
  const usersCollection = getUsersCollection();

  // Check if username or email already exists
  const existingUser = await usersCollection.findOne({
    $or: [
      { username: userData.username.toLowerCase() },
      { email: userData.email.toLowerCase() }
    ]
  });

  if (existingUser) {
    if (existingUser.username === userData.username.toLowerCase()) {
      throw new Error('Username already exists');
    } else {
      throw new Error('Email already exists');
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

  // Create new user object
  const newUser = {
    username: userData.username.toLowerCase(),
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    name: userData.name || '',
    location: userData.location || '',
    bio: userData.bio || '',
    profileImage: userData.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg',
    cards: [], // Initialize empty cards array
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Insert user into database
  const result = await usersCollection.insertOne(newUser);
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return { 
    ...userWithoutPassword, 
    _id: result.insertedId 
  };
}

/**
 * Login a user
 * @param {string} username - Username or email
 * @param {string} password - Plain text password
 * @returns {Promise<Object>} - User data and JWT token
 */
async function loginUser(username, password) {
  const usersCollection = getUsersCollection();

  // Find user by username or email
  const user = await usersCollection.findOne({
    $or: [
      { username: username.toLowerCase() },
      { email: username.toLowerCase() }
    ]
  });

  if (!user) {
    throw new Error('Invalid username or password');
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid username or password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user._id,
      username: user.username 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Return user without password and token
  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token
  };
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User data without password
 */
async function getUserById(userId) {
  const usersCollection = getUsersCollection();
  
  const user = await usersCollection.findOne({ _id: userId });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

module.exports = {
  registerUser,
  loginUser,
  getUserById
};