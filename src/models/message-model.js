const { DataTypes, Op } = require("sequelize");
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
    const allMessages = await MessageSchema.findAll({
      attributes: ["id", "sender", "receiver", "message"],
      where: {
        sender: {
          [Op.or]: [userID, otherUserID],
        },
        receiver: {
          [Op.or]: [userID, otherUserID],
        },
      },
    });

    const allMessagesProcessed = allMessages.map((item) => {
      return {
        ...item.dataValues,
        bgColor: item.dataValues.sender === userID ? "aqua" : "lightgreen",
        alignSelf:
          item.dataValues.sender === userID ? "flex-start" : "flex-end",
      };
    });

    return allMessagesProcessed;
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
