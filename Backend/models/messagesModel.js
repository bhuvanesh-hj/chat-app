const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const Messages = sequelize.define(
  "messages",
  {
    content: {
      type: DataTypes.STRING,
      allowNull: true,
      trim: true,
    },
    isImage: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Messages;
