const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const ArchiveMessages = sequelize.define(
  "archiveMessages",
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
    addedTime: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ArchiveMessages;
