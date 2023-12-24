const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../config/generateToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    if (!name || !email || !password || !mobileNumber) {
      res.status(400).json({ message: "Required all fields", success: false });
      return;
    }

    const userExists = await User.findOne({ where: { email } });

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

      const response = await User.create({
        name,
        email,
        mobileNumber,
        password: hashPassword,
      });
      res.status(200).json({
        data: {
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

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found", success: false });
      return;
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (err){
        throw new Error("Something went wrong!");
      }

      if (result) {
        res.status(201).json({
          message: "login successful ",
          data: {
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

module.exports = { registerUser, loginUser };
