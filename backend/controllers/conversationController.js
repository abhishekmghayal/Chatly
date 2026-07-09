const Conversation = require("../models/conversation.models");

const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "name username profilePicture isOnline")
      .populate("lastMessageSender", "name username ")
      .sort({ updatedAt: -1 });

    const formattedConversations = conversations.map((conv) => {
      const otherParticipant = conv.participants.find(
        (p) => p._id.toString() !== userId,
      );
      return {
        _id: conv._id,
        user: otherParticipant,
        lastMessage: conv.lastMessage,
        lastMessageTime: conv.lastMessageTime,
        lastMessageSender: conv.lastMessageSender,
      };
    });
    res
      .status(200)
      .json({
        message: "User conversations fetched successfully",
        success: true,
        data: formattedConversations,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching user conversations",
        error: error.message,
      });
  }
};

module.exports = {
  getUserConversations,
};
