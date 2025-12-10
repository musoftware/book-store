const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: String,
    default: 'Unknown',
  },
  description: {
    type: String,
    default: '',
  },
  image_url: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 0,
  },
  num_pages: {
    type: Number,
    default: 0,
  },
  formats: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Index for faster queries
bookSchema.index({ title: 'text', authors: 'text' });

module.exports = mongoose.model('Book', bookSchema);

