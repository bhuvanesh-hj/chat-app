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
      res.status(401).json({ message: "User exists please login", success: false });
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

module.exports = { registerUser };
