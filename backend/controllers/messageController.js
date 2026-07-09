const Conversation = require("../models/Conversation.models");
const Message = require("../models/Message.models");
const { getIO, userSocketMap } = require("../socket/socket");
const cloudinary = require("../config/cloudinary.js");
const { getDataUri } = require("../utils/datauri.js");
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.receiverId;
    const { text } = req.body;

    if (!text && !req.file) {
      return res.status(400).json({
        message: "Message text or image is required",
        success: false,
      });
    }
    let imageUrl = "";
    let videoUrl = "";
    if (req.file) {
      console.log("FILE RECEIVED");
      const fileUri = getDataUri(req.file);
      try {
        const cloudResponse = await cloudinary.uploader.upload(
          fileUri.content,
          {
            folder: "chat-app/chat-images",
            resource_type: "auto",
          },
        );

        console.log("UPLOAD SUCCESS");
        console.log(cloudResponse);

        if (req.file.mimetype.startsWith("image/")) {
          imageUrl = cloudResponse.secure_url;
        } else if (req.file.mimetype.startsWith("video/")) {
          videoUrl = cloudResponse.secure_url;
        }
      } catch (err) {
        console.log("CLOUDINARY ERROR:");
        console.log(err);
      }
    }
    // check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    let newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      conversation: conversation._id,
      text,
      image: imageUrl,
      video: videoUrl,
    });
    newMessage = await newMessage.populate("sender", "username");
    conversation.lastMessage = text || "📷 Image" || "📹 Video";
    conversation.lastMessageSender = senderId;
    conversation.lastMessageTime = newMessage.createdAt;
    await conversation.save();

    res.status(201).json({
      message: "Message sent successfully",
      success: true,
      data: newMessage,
    });

    // Emit the new message to the receiver if they are online
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      getIO().to(receiverSocketId).emit("newMessage", newMessage);
    }
  } catch (error) {
    res.status(500).json({
      message: "Error sending message",
      error: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.receiverId;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
        success: false,
      });
    }
    const messages = await Message.find({
      conversation: conversation._id,
    })
      .populate("sender", "username")
      .sort({ createdAt: 1 });

    await Message.updateMany(
      {
        conversation: conversation._id,
        receiver: senderId,
        isSeen: false,
      },
      {
        $set: { isSeen: true, seenAt: new Date() },
      },
    );
    res.status(200).json({
      message: "Messages fetched successfully",
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching messages",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
