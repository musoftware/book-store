import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Books API
export const booksAPI = {
  // Get all books
  getAll: (page = 1, limit = 100) => {
    return api.get(`/books?page=${page}&limit=${limit}`);
  },

  // Get single book by ID
  getById: (id) => {
    return api.get(`/books/${id}`);
  },

  // Search books
  search: (query) => {
    return api.get(`/books/search/${query}`);
  },

  // Seed books (admin function)
  seed: () => {
    return api.post('/books/seed');
  },
};

// Favorites API
export const favoritesAPI = {
  // Get all favorites for a user
  getAll: (userId = 'default-user') => {
    return api.get(`/favorites?userId=${userId}`);
  },

  // Check if book is favorited
  check: (bookId, userId = 'default-user') => {
    return api.get(`/favorites/check/${bookId}?userId=${userId}`);
  },

  // Add book to favorites
  add: (book, userId = 'default-user') => {
    return api.post('/favorites', {
      userId,
      bookId: book.id,
      book,
    });
  },

  // Remove book from favorites
  remove: (bookId, userId = 'default-user') => {
    return api.delete(`/favorites/${bookId}?userId=${userId}`);
  },

  // Clear all favorites
  clear: (userId = 'default-user') => {
    return api.delete(`/favorites?userId=${userId}`);
  },
};

export default api;

