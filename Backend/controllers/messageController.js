const asyncHandler = require("express-async-handler");

// Models
const Messages = require("../models/messagesModel");
const Chats = require("../models/chatModel");
const Users = require("../models/userModel");

const addMessages = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    res.status(400);
    throw new Error("Invalid content and chatId");
  }

  try {
    const newMessage = await Messages.create({
      senderId: req.user.id,
      content,
      chatId,
    });

    const message = await Messages.findByPk(newMessage.id, {
      include: [
        {
          model: Users,
          as: "sender",
          attributes: ["name", "email", "id"],
        },
        {
          model: Chats,
          as: "chat",
          include: [
            { model: Users, as: "users", attributes: ["name", "email", "id"] },
          ],
        },
      ],
    });

    const updatedChat = await Chats.findByPk(chatId);

    updatedChat.latestMessageId = message.id;

    await updatedChat.save();

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Messages.findAll({
      where: { chatId: req.params.chatId },
      include: [
        {
          model: Users,
          as: "sender",
          attributes: ["name", "email", "id"],
        },
        {
          model: Chats,
          as: "chat",
        },
      ],
    });
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { addMessages, allMessages };
