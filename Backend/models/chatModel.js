const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const Chats = sequelize.define('chats', {
  chatName: {
    type: DataTypes.STRING,
    allowNull: true,
    trim: true,
  },
  isGroupChat: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = Chats;
