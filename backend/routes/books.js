const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const axios = require('axios');

// Seed books from external API (run once to populate database)
router.post('/seed', async (req, res) => {
  try {
    const response = await axios.get('https://example-data.draftbit.com/books?_limit=100');
    const books = response.data;

    // Insert books, skip duplicates
    const results = await Book.insertMany(books, { ordered: false });
    
    res.json({
      message: `Successfully seeded ${results.length} books`,
      total: results.length,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - some books already exist
      res.json({
        message: 'Some books already exist in database',
        error: error.message,
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get all books with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments();

    res.json({
      data: books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ id: parseInt(req.params.id) });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search books
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { authors: { $regex: query, $options: 'i' } },
      ],
    }).limit(50);

    res.json({ data: books, count: books.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new book
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Book with this ID already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update a book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ id: parseInt(req.params.id) });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully', book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

