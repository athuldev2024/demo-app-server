const { DataTypes } = require("sequelize");
const { customAlphabet } = require("nanoid");
const createError = require("http-errors");
const { sequelize } = require("./index");

const nanoid = customAlphabet("1234567890", 18);

const STATUS_CODES = require("../constants/status-codes");
const MESSAGES = require("../constants/messages");

const MessageSchema = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiver: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

async function storeMessageToDB(body) {
  try {
    const messageID = nanoid();

    await MessageSchema.create({
      id: messageID,
      ...body,
    });

    return messageID;
  } catch (err) {
    console.log("Model Error: ", err);
    throw createError(err.statusCode, err.message);
  }
}

async function deleteMessageDB(messageID) {
  try {
    const result = await MessageSchema.destroy({
      where: {
        id: messageID,
      },
    });

    if (result === 0) {
      throw createError(STATUS_CODES.noResource, MESSAGES.noResource);
    } else {
      return true;
    }
  } catch (err) {
    throw createError(err.statusCode, err.message);
  }
}

async function updateMessageDB(message, messageID) {
  try {
    const result = await MessageSchema.update(
      { message },
      {
        where: {
          id: messageID,
        },
      }
    );

    if (result[0] === 0) {
      throw createError(STATUS_CODES.noResource, MESSAGES.noResource);
    }

    return true;
  } catch (err) {
    throw createError(err.statusCode, err.message);
  }
}

async function getAllMessagesDB(userID, otherUserID) {
  try {
    const myMessages = await MessageSchema.findAll({
      attributes: ["id", "sender", "receiver", "message"],
      where: {
        sender: userID,
        receiver: otherUserID,
      },
    });

    const otherMessages = await MessageSchema.findAll({
      attributes: ["id", "sender", "receiver", "message"],
      where: {
        sender: otherUserID,
        receiver: userID,
      },
    });

    const allMessages = [
      ...myMessages.map((item) => {
        return { ...item.dataValues, bgColor: "aqua" };
      }),
      ...otherMessages.map((item) => {
        return { ...item.dataValues, bgColor: "green" };
      }),
    ].sort(function (itemOne, itemTwo) {
      return (
        new Date(itemOne.updatedAt).getTime() -
        new Date(itemTwo.updatedAt).getTime()
      );
    });

    return allMessages;
  } catch (err) {
    throw createError(err.statusCode, err.message);
  }
}

module.exports = {
  storeMessageToDB,
  deleteMessageDB,
  updateMessageDB,
  getAllMessagesDB,
};
