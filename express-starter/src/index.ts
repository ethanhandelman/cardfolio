import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
const { connectToDB } = require('../db/config'); // JS import
const { ensureDirectories } = require('../utils/imageUtils'); // JS import
const authRoutes = require('../routes/auth'); // JS import
const cardRoutes = require('../routes/cards'); // JS import
const userRoutes = require('../routes/users'); // JS import

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();

// Set port
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Serve static files from the uploads directory
const uploadsPath: string = path.join(__dirname, '..', 'uploads');
console.log('Serving static files from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Serve static files from your frontend build directory
const staticDir: string = process.env.STATIC_DIR || 'public';
const staticPath: string = path.join(__dirname, staticDir);
console.log('Serving frontend from:', staticPath);
app.use(express.static(staticPath));

// Connect to MongoDB and set up directories before starting server
async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectToDB();
    
    // Ensure upload directories exist
    await ensureDirectories();
    
    // Routes
    app.use('/auth', authRoutes);
    app.use('/api/cards', cardRoutes);
    app.use('/api/users', userRoutes);
    
    // Test route
    app.get('/api', (req: Request, res: Response): void => {
      res.json({ message: 'Cardfolio API is running' });
    });
    
    // Debug route to list all files in uploads/cards directory
    app.get('/debug/uploads', (req: Request, res: Response): void => {
      try {
        const files: string[] = fs.readdirSync(path.join(__dirname, 'uploads/cards'));
        res.json({
          uploadsPath: path.join(__dirname, 'uploads/cards'),
          files: files,
          urls: files.map(file => `${req.protocol}://${req.get('host')}/uploads/cards/${file}`)
        });
      } catch (error) {
        if (error instanceof Error) {
          res.json({ error: error.message });
        } else {
          res.json({ error: 'Unknown error' });
        }
      }
    });
    
    // Catch-all route for frontend SPA
    // This must be AFTER all other routes
    app.get('*', (req: Request, res: Response): void => {
      res.sendFile(path.join(__dirname, staticDir, 'index.html'));
    });
    
    // Error handling middleware
    app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
      console.error(err.stack);
      res.status(500).json({ 
        success: false, 
        message: 'Something went wrong on the server!' 
      });
    });
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Frontend available at port:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error | unknown) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});