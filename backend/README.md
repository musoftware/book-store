# Book Store Backend API

Express.js backend for the Book Store application using MySQL and Sequelize.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Set up MySQL database:
   - Install MySQL on your system (or use a cloud MySQL service)
   - Create a database named `bookstore` (or update DB_NAME in `.env`)
   ```sql
   CREATE DATABASE bookstore;
   ```

4. Update `.env` with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=bookstore
   DB_USER=root
   DB_PASSWORD=your-password
   ```

5. Start the server (tables will be created automatically):
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

6. Seed the database with books:
```bash
# In another terminal or use Postman/curl:
curl -X POST http://localhost:5000/api/books/seed
```

## API Endpoints

### Books
- `GET /api/books` - Get all books (with pagination)
- `GET /api/books/:id` - Get single book by ID
- `GET /api/books/search/:query` - Search books by title or author
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `POST /api/books/seed` - Seed database with books from external API

### Favorites
- `GET /api/favorites?userId=default-user` - Get all favorites for a user
- `GET /api/favorites/check/:bookId?userId=default-user` - Check if book is favorited
- `POST /api/favorites` - Add book to favorites
- `DELETE /api/favorites/:bookId?userId=default-user` - Remove book from favorites
- `DELETE /api/favorites?userId=default-user` - Clear all favorites

### Health Check
- `GET /api/health` - Check if API is running

## Example Requests

### Get all books
```bash
GET http://localhost:5000/api/books
```

### Get single book
```bash
GET http://localhost:5000/api/books/1
```

### Add to favorites
```bash
POST http://localhost:5000/api/favorites
Content-Type: application/json

{
  "bookId": 1,
  "book": {
    "id": 1,
    "title": "Book Title",
    "authors": "Author Name",
    ...
  }
}
```

### Remove from favorites
```bash
DELETE http://localhost:5000/api/favorites/1?userId=default-user
```

