const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController.js");
const isAuthenticated = require("../middleware/isAuthenticated.js");
const { singleUpload } = require("../middleware/multer.js");
const router = express.Router();

router.post(
  "/send-message/:receiverId",
  isAuthenticated,
  singleUpload,
  sendMessage,
);
router.get("/get-messages/:receiverId", isAuthenticated, getMessages);
module.exports = router;
