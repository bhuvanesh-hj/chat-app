const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("chat-app", "root", "Bhuvi112233@", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
