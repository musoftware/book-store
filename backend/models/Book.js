const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authors: {
    type: DataTypes.STRING,
    defaultValue: 'Unknown',
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  image_url: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  num_pages: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  formats: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
}, {
  tableName: 'books',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['title'],
    },
    {
      fields: ['authors'],
    },
  ],
});

module.exports = Book;
