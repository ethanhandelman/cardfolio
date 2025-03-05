const express = require('express');
const cors = require('cors');
const { connectToDB } = require('./db/config');
const authRoutes = require('./routes/auth');

// Load environment variables
require('dotenv').config();

// Create Express app
const app = express();

// Set port
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB before starting server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDB();
    
    // Routes
    app.use('/auth', authRoutes);
    
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