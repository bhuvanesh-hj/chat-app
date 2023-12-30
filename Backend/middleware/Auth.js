const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // decode the token to get the id init
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const user = await Users.findAll({ where: { id: decode.id } });

      req.user = user[0];
      next();
    } catch (error) {
      console.log(`Error while authorization: ${error}`);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, invalid token");
  }
});

module.exports = { protect };
