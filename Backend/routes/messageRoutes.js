const router = require("express").Router();

const { protect } = require("../middleware/Auth");

const {
  addMessages,
  allMessages,
} = require("../controllers/messageController");

router.route("/").post(protect, addMessages);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
