const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Import routes
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');

// Import custom error handler (optional)
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Allow cross-origin requests
app.use(morgan('dev')); // Log requests in dev mode

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Blog API 🚀' });
});

// Error handling middleware (optional but recommended)
app.use(errorHandler);

// Export app for server.js
module.exports = app;
