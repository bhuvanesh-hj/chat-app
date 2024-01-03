const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require("path");

const sequelize = require("./config/db");

// Importing routes
const userRoutes = require("./routes/userRoutes");
const chatsRoutes = require("./routes/chatsRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Models
const Users = require("./models/userModel");
const Chats = require("./models/chatModel");
const Messages = require("./models/messagesModel");
const ArchiveMessages = require("./models/archiveMessagesModel");

// cron job
const cronServices = require("./services/cron");
cronServices.job.start();

const { notFound, errorHandler } = require("./middleware/errorHandlers");

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chats", chatsRoutes);
app.use("/api/message", messageRoutes);

/*---------------------------Deployment-------------------------*/
// const dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(dirname1, "frontend/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(dirname1, "frontend", "build", "index.html"));
//   });
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

/*---------------------------Deployment-------------------------*/

// Error handlers
app.use(notFound);
app.use(errorHandler);

Chats.belongsTo(Messages, {
  foreignKey: "latestMessageId",
  as: "latestMessage",
});
Chats.belongsTo(Users, { foreignKey: "groupAdminId", as: "groupAdmin" });

Users.belongsToMany(Chats, { through: "UserChat", as: "chats" });
Chats.belongsToMany(Users, { through: "UserChat", as: "users" });

Messages.belongsTo(Users, { foreignKey: "senderId", as: "sender" });
Messages.belongsTo(Chats, { foreignKey: "chatId", as: "chat" });

ArchiveMessages.belongsTo(Users, { foreignKey: "senderId", as: "sender" });
ArchiveMessages.belongsTo(Chats, { foreignKey: "chatId", as: "chat" });

sequelize.sync({ force: false }).then((res) => {
  const server = app.listen(port, () => {
    console.log(`Server is running on the ${port}`);
  });

  const io = require("socket.io")(server, {
    pingTimeOut: 60000,
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData?.id);
      socket.emit("connected");
    });
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined the room :", room);
    });
    socket.on("new message", (newMessageReceived) => {
      var chat = newMessageReceived.chat;

      if (!chat.users) return console.log("chat.users not found");

      chat.users.forEach((user) => {
        if (user.id === newMessageReceived.sender.id) return;

        socket.in(user.id).emit("message received", newMessageReceived);
      });
    });
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData.id);
    });
  });
});
