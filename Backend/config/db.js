const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_SCHEMA_NAME,
  process.env.DATABASE_USER_NAME,
  process.env.DATABASE_USER_PASSWORD,
  {
    dialect: process.env.DATABASE_NAME,
    host: process.env.HOST,
  }
);

module.exports = sequelize;
