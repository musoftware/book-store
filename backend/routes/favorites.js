const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const Book = require('../models/Book');

// Get all favorites for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });
    
    res.json({
      data: favorites.map(fav => fav.book),
      count: favorites.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if a book is favorited
router.get('/check/:bookId', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const bookId = parseInt(req.params.bookId);
    
    const favorite = await Favorite.findOne({ userId, bookId });
    
    res.json({ isFavorited: !!favorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add book to favorites
router.post('/', async (req, res) => {
  try {
    const userId = req.body.userId || 'default-user';
    const bookId = req.body.bookId || req.body.book?.id;

    if (!bookId) {
      return res.status(400).json({ error: 'Book ID is required' });
    }

    // Check if book exists in database, if not, use the provided book data
    let bookData = req.body.book;
    if (!bookData) {
      const book = await Book.findOne({ id: bookId });
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      bookData = book.toObject();
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ userId, bookId });
    if (existingFavorite) {
      return res.status(400).json({ error: 'Book already in favorites' });
    }

    const favorite = new Favorite({
      userId,
      bookId,
      book: bookData,
    });

    await favorite.save();
    res.status(201).json({ message: 'Book added to favorites', favorite });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Book already in favorites' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Remove book from favorites
router.delete('/:bookId', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const bookId = parseInt(req.params.bookId);

    const favorite = await Favorite.findOneAndDelete({ userId, bookId });

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Book removed from favorites', favorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all favorites for a user
router.delete('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const result = await Favorite.deleteMany({ userId });

    res.json({
      message: 'All favorites cleared',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

