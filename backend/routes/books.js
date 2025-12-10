const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Book = require('../models/Book');
const axios = require('axios');

// Seed books from external API (run once to populate database)
router.post('/seed', async (req, res) => {
  try {
    const response = await axios.get('https://example-data.draftbit.com/books?_limit=100');
    const books = response.data;

    // Insert books, skip duplicates using findOrCreate
    let created = 0;
    let skipped = 0;

    for (const book of books) {
      const [, wasCreated] = await Book.findOrCreate({
        where: { id: book.id },
        defaults: book,
      });
      if (wasCreated) {
        created++;
      } else {
        skipped++;
      }
    }
    
    res.json({
      message: `Seeding completed`,
      created,
      skipped,
      total: books.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all books with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    const { count, rows: books } = await Book.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    res.json({
      data: books,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ 
      where: { id: parseInt(req.params.id) }
    });
    
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
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { authors: { [Op.like]: `%${query}%` } },
        ],
      },
      limit: 50,
    });

    res.json({ data: books, count: books.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new book
router.post('/', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Book with this ID already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update a book
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Book.update(req.body, {
      where: { id: parseInt(req.params.id) },
      returning: true,
    });

    if (updated === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const book = await Book.findOne({ 
      where: { id: parseInt(req.params.id) }
    });

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ 
      where: { id: parseInt(req.params.id) }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await book.destroy();
    res.json({ message: 'Book deleted successfully', book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

