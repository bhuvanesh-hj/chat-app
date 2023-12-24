const express = require("express");
require("dotenv").config();

const sequelize = require("./config/db");

const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/user", userRoutes);

sequelize.sync().then((res) => {
  app.listen(port, () => console.log(`Server is running on the ${port}`));
});
