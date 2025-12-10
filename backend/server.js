const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const Book = require('./models/Book');
const Favorite = require('./models/Favorite');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/books', require('./routes/books'));
app.use('/api/favorites', require('./routes/favorites'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Book Store API is running' });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Connected to MySQL database');

    // Sync database models (creates tables if they don't exist)
    // Use { alter: true } to update existing tables, or { force: true } to drop and recreate
    await sequelize.sync({ alter: false });
    console.log('Database models synchronized');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

startServer();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

