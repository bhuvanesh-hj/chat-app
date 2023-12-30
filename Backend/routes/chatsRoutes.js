const router = require("express").Router();
const {
  accessChats,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  renameGroup,
  addToGroup,
} = require("../controllers/chatsController");
const { protect } = require("../middleware/Auth");

router.route("/").post(protect, accessChats).get(protect, fetchChats);
// router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/group_rename").put(protect, renameGroup);
router.route("/group_add").put(protect, addToGroup);
router.route("/group_remove").put(protect, removeFromGroup);

module.exports = router;
