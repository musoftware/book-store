# Book Store Application

A full-stack book store application built with React (frontend) and Node.js + Express (backend).

## Features

- 📚 Browse and search books
- ❤️ Add/remove books to favorites
- 🔍 View detailed book information
- 💾 Persistent favorites storage (MongoDB)
- 🎨 Modern, responsive UI

## Tech Stack

### Frontend
- React 18
- Redux Toolkit (state management)
- React Router (routing)
- Axios (HTTP client)
- Tailwind CSS (styling)

### Backend
- Node.js
- Express.js
- MySQL (with Sequelize ORM)
- CORS enabled

## Project Structure

```
book-store/
├── backend/              # Express.js backend
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── server.js        # Express server
│   └── package.json
├── src/                 # React frontend
│   ├── components/     # React components
│   ├── slice/          # Redux slices
│   ├── utils/          # Utility functions
│   └── ...
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (local installation or cloud MySQL service)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Create MySQL database:
   ```sql
   CREATE DATABASE bookstore;
   ```

5. Update `.env` with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=bookstore
   DB_USER=root
   DB_PASSWORD=your-password
   ```

6. Start the backend server (tables will be created automatically):
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

7. Seed the database (optional):
   ```bash
   curl -X POST http://localhost:5000/api/books/seed
   ```

### Frontend Setup

1. Install dependencies (from root directory):
```bash
npm install
```

2. Create `.env` file in root (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `GET /api/books/search/:query` - Search books
- `POST /api/books/seed` - Seed database with books

### Favorites
- `GET /api/favorites` - Get all favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:bookId` - Remove from favorites

## Development

- Backend runs on port 5000
- Frontend runs on port 3000
- Make sure both servers are running for full functionality

## Notes

- The app uses Redux for local state management and syncs with the backend
- Favorites are stored in MySQL and persist across sessions
- Database tables are created automatically on first run
- If the backend is unavailable, the frontend falls back to the external API
