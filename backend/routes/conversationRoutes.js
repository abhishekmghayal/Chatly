const express = require("express");
const router = express.Router();
const {
  getUserConversations,
} = require("../controllers/conversationController");

const isAuthenticated = require("../middleware/isAuthenticated");
router.get("/", isAuthenticated, getUserConversations);
module.exports = router;
