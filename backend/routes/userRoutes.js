const express = require("express");
const {
  register,
  login,
  logout,
  updateProfile,
  getAllUsers,
} = require("../controllers/userController.js");
const { singleUpload } = require("../middleware/multer.js");
const isAuthenticated = require("../middleware/isAuthenticated.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
// router.post("/update-profile", isAuthenticated, updateProfile);
router
  .route("/update-profile")
  .post(isAuthenticated, singleUpload, updateProfile);
router.get("/all-users", isAuthenticated, getAllUsers);
module.exports = router;
