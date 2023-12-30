const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../config/generateToken");
const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    if (!name || !email || !password || !mobileNumber) {
      res.status(400).json({ message: "Required all fields", success: false });
      return;
    }

    const userExists = await Users.findOne({ where: { email } });

    if (userExists) {
      res
        .status(401)
        .json({ message: "User exists please login", success: false });
      return;
    }

    const salt = 10;

    bcrypt.hash(password, salt, async function (err, hashPassword) {
      if (err)
        res
          .status(500)
          .json({ message: "Something went wrong", success: false });

      const response = await Users.create({
        name,
        email,
        mobileNumber,
        password: hashPassword,
      });
      res.status(200).json({
        data: {
          id: response.id,
          name: response.name,
          token: generateToken(response.id),
          email: response.email,
          mobileNumber: response.mobileNumber,
        },
        message: "User registered successfully",
        success: true,
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Required all fields", success: false });
      return;
    }

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found", success: false });
      return;
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        throw new Error("Something went wrong!");
      }

      if (result) {
        res.status(201).json({
          message: "login successful ",
          data: {
            id: user.id,
            name: user.name,
            token: generateToken(user.id),
            email: user.email,
            mobileNumber: user.mobileNumber,
          },
          success: true,
        });
      } else {
        res.status(401).json({ message: "User not authorized" });
      }
    });
  } catch (error) {
    console.log(`Error in the login setup: ${error}`);
    res.status(500).json({ message: error.message, success: false });
  }
};

const allUsers = asyncHandler(async (req, res) => {
  const users = await Users.findAll({
    where: {
      [Op.and]: [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { email: { [Op.like]: `%${req.query.search}%` } },
        ,
        { id: { [Op.ne]: req.user.id } },
      ],
    },
  });

  res.send(users);
});

module.exports = { registerUser, loginUser, allUsers };
