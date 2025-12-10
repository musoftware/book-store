const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'default-user',
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  book: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  tableName: 'favorites',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'bookId'],
      name: 'unique_user_book'
    },
  ],
});

module.exports = Favorite;
