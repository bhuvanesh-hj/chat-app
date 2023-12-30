const router = require("express").Router();

const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/Auth");

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", loginUser);

module.exports = router;
