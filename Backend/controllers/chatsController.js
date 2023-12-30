const asyncHandler = require("express-async-handler");
const Users = require("../models/userModel");
const Chats = require("../models/chatModel");
const Messages = require("../models/messagesModel");
const { Sequelize, Op } = require("sequelize");

const accessChats = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("userId param is not sent with request");
    return res.sendStatus(400);
  }

  try {
    // Check if a direct chat exists between the current user and the specified user
    const isChat = await Chats.findAll({
      where: {
        isGroupChat: false,
      },
      include: [
        {
          model: Users,
          as: "users",
          where: {
            id: [userId, req.user.id],
          },
          attributes: { exclude: ["password"] },
        },
        {
          model: Messages,
          as: "latestMessage",
          include: [
            {
              model: Users,
              as: "sender",
              attributes: ["name", "email"],
            },
          ],
        },
      ],
    });

    if (isChat.find((chat) => chat.users.length > 1)) {
      console.log("old");
      isChat.find((chat) => {
        if (chat.users.length > 1) {
          res.send(chat);
          return;
        }
      });
    } else {
      const createdChat = await Chats.create({
        chatName: "sender",
        isGroupChat: false,
      });

      const userInstances = await Users.findAll({
        where: {
          id: [userId, req.user.id],
        },
      });

      await createdChat.addUsers(userInstances);

      const fullChat = await Chats.findOne({
        where: { id: createdChat.id },
        include: [
          {
            model: Users,
            as: "users",
            attributes: { exclude: ["password"] },
          },
        ],
      });
      console.log("new");
      res.status(200).send(fullChat);
    }
  } catch (error) {
    console.error(`Error at the accessChats: ${error}`);
    res.status(400).send({ error: error.message });
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    const results = await Chats.findAll({
      include: [
        {
          model: Users,
          as: "users",
          attributes: { exclude: ["password"] },
        },
        {
          model: Users,
          as: "groupAdmin",
          attributes: { exclude: ["password"] },
        },
        {
          model: Messages,
          as: "latestMessage",
          include: [
            {
              model: Users,
              as: "sender",
              attributes: ["name", "email"],
            },
          ],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    const finalResults = results.filter((chats) =>
      chats.users.find((user) => user.id === req.user.id)
    );

    res.status(200).send(finalResults);
  } catch (error) {
    console.error(`Error fetching chats: ${error}`);
    res.status(400).send({ error: error.message });
  }
});

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  const users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to create the group chat");
  }

  try {
    const groupChat = await Chats.create({
      chatName: req.body.name,
      isGroupChat: true,
      groupAdminId: req.user.id,
    });

    await groupChat.addUsers(users);

    // Assuming req.user contains the current user
    await groupChat.addUser(req.user);

    const fullGroupChat = await Chats.findByPk(groupChat.id, {
      include: [
        { model: Users, as: "users", attributes: { exclude: ["password"] } },
        {
          model: Users,
          as: "groupAdmin",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedChat = await Chats.findByPk(chatId);

    if (!updatedChat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    updatedChat.chatName = chatName;
    await updatedChat.save();

    const fullUpdatedChat = await Chats.findByPk(chatId, {
      include: [
        { model: Users, as: "users", attributes: { exclude: ["password"] } },
        {
          model: Users,
          as: "groupAdmin",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    res.status(200).json(fullUpdatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chats.findByPk(chatId);

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    const user = await Users.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await chat.addUser(user);

    const updatedChat = await Chats.findByPk(chatId, {
      include: [
        { model: Users, as: "users", attributes: { exclude: ["password"] } },
        {
          model: Users,
          as: "groupAdmin",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chats.findByPk(chatId);

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    const user = await Users.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await chat.removeUser(user);

    const updatedChat = await Chats.findByPk(chatId, {
      include: [
        { model: Users, as: "users", attributes: { exclude: ["password"] } },
        {
          model: Users,
          as: "groupAdmin",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  accessChats,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
