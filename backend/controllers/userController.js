const User = require("../models/user.models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary.js");
const { getDataUri } = require("../utils/datauri.js");
const register = async (req, res) => {
  try {
    const { email, name, password, bio, username } = req.body;

    if (!name || !email || !password || !bio || !username) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    await User.create({
      name,
      email,
      password: hashedPassword,
      username,
      bio,
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error registering user",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // validate
    if (!username || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // find user
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    // jwt payload
    const tokenData = {
      userId: user._id,
    };

    // generate token
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // update online status
    user.isOnline = true;
    user.lastSeen = Date.now();

    await user.save();

    // remove password before sending
    user = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      friends: user.friends,
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        token,
        user,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user.isOnline = false;
    user.lastSeen = Date.now();

    await user.save();

    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "User logged out successfully",
        success: true,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging out",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, bio, email, password, username } = req.body;
    const profilePicture = req.file;
    console.log(profilePicture);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({
        email,
        _id: { $ne: userId },
      });

      if (existingEmail) {
        return res.status(409).json({
          message: "Email already in use",
          success: false,
        });
      }

      user.email = email;
    }

    if (username && username !== user.username) {
      const existingUsername = await User.findOne({
        username,
        _id: { $ne: userId },
      });

      if (existingUsername) {
        return res.status(409).json({
          message: "Username already in use",
          success: false,
        });
      }

      user.username = username;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (profilePicture) {
      console.log("above all");

      const fileUri = getDataUri(profilePicture);

      try {
        const cloudResponse = await cloudinary.uploader.upload(
          fileUri.content,
          {
            folder: "chat-app/profile-pictures",
            resource_type: "auto",
          },
        );

        console.log("UPLOAD SUCCESS");
        console.log(cloudResponse);

        user.profilePicture = cloudResponse.secure_url;
      } catch (err) {
        console.log("CLOUDINARY ERROR:");
        console.log(err);
      }
    }

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating profile",
      error: error?.message || error?.error?.message || "Unknown error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const users = await User.find({ _id: { $ne: currentUserId } }).select(
      "-password",
    );
    res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  updateProfile,
  getAllUsers,
};
