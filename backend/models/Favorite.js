const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'default-user', // For now, using default user. Can be extended for multi-user
  },
  bookId: {
    type: Number,
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, {
  timestamps: true,
});

// Ensure one user can't favorite the same book twice
favoriteSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);

