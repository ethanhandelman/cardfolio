const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToDB } = require('./db/config');
const { ensureDirectories } = require('./utils/imageUtils');
const authRoutes = require('./routes/auth');
const cardRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');

// Load environment variables
require('dotenv').config();

// Create Express app
const app = express();

// Set port
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Serve static files from the uploads directory
// Log the exact path being used
const uploadsPath = path.join(__dirname, 'uploads');
console.log('Serving static files from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Connect to MongoDB and set up directories before starting server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDB();
    
    // Ensure upload directories exist
    await ensureDirectories();
    
    // API Routes - make sure these come BEFORE the static frontend serving
    app.use('/auth', authRoutes);
    app.use('/api/cards', cardRoutes);
    app.use('/api/users', userRoutes);
    
    // Test route - changed from '/' to '/api' to avoid conflict with frontend routes
    app.get('/api', (req, res) => {
      res.json({ message: 'Cardfolio API is running' });
    });
    
    // Debug route to list all files in uploads/cards directory
    app.get('/debug/uploads', (req, res) => {
      const fs = require('fs');
      try {
        const files = fs.readdirSync(path.join(__dirname, 'uploads/cards'));
        res.json({
          uploadsPath: path.join(__dirname, 'uploads/cards'),
          files: files,
          urls: files.map(file => `${req.protocol}://${req.get('host')}/uploads/cards/${file}`)
        });
      } catch (error) {
        res.json({ error: error.message });
      }
    });
    
    // Serve static files from the React build directory
    const frontendBuildPath = path.join(__dirname, '../frontend/dist');
    console.log('Serving frontend static files from:', frontendBuildPath);
    app.use(express.static(frontendBuildPath));
    
    // Catch-all route to serve the React app for client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
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