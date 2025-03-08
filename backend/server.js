const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToDB } = require('./db/config');
const { ensureDirectories } = require('./utils/imageUtils');
const authRoutes = require('./routes/auth');
const cardRoutes = require('./routes/cards');

// Load environment variables
require('dotenv').config();

// Create Express app
const app = express();

// Set port
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB and set up directories before starting server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDB();
    
    // Ensure upload directories exist
    await ensureDirectories();
    
    // Routes
    app.use('/auth', authRoutes);
    app.use('/api/cards', cardRoutes);
    
    // Test route
    app.get('/', (req, res) => {
      res.json({ message: 'Cardfolio API is running' });
    });
    
    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ 
        success: false, 
        message: 'Something went wrong on the server!' 
      });
    });
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});