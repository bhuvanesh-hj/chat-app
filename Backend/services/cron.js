const { CronJob } = require("cron");
const Messages = require("../models/messagesModel");
const ArchiveMessages = require("../models/archiveMessagesModel");
const { Op } = require("sequelize");

exports.job = new CronJob(
  '0 0 * * *', 
  function () {
    archiveChats();
  },
  null,
  false,
  'Asia/Kolkata'
);

async function archiveChats() {
  try {
    const fiveDay = new Date();
    fiveDay.setDate(fiveDay.getDate() - 5);

    const messagesToArchive = await Messages.findAll({
      where: { updatedAt: { [Op.lt]: fiveDay } },
    });

    console.log(messagesToArchive);

    await Promise.all(
      messagesToArchive.map(async (message) => {
        await ArchiveMessages.create({
          id: message.id,
          content: message.content,
          isImage: message.isImage,
          senderId: message.senderId,
          chatId: message.chatId,
          addedTime: message.updatedAt,
        });
        await message.destroy();
      })
    );
    console.log("Old messages archived successfully");
  } catch (error) {
    console.log("Error while archiving old messages", error);
  }
}

// module.exports = { archiveChats };
