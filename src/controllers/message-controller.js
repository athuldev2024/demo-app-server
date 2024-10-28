const createError = require("http-errors");

const STATUS_CODES = require("../constants/status-codes");
const MESSAGES = require("../constants/messages");
const {
  storeMessageToDB,
  deleteMessageDB,
  updateMessageDB,
} = require("../models/message-model");

const storeMessage = async (req, res, next) => {
  try {
    const messageID = await storeMessageToDB(req.body);

    return res
      .status(STATUS_CODES.messageAdded)
      .json({ message: MESSAGES.messageAdded, messageID });
  } catch (error) {
    next(createError(error.statusCode, error.message));
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    await deleteMessageDB(req.params.messageID);

    return res
      .status(STATUS_CODES.noContent)
      .json({ message: MESSAGES.deleted });
  } catch (error) {
    next(createError(error.statusCode, error.message));
  }
};

const updateMessage = async (req, res, next) => {
  try {
    await updateMessageDB(req.body.message, req.params.messageID);

    return res
      .status(STATUS_CODES.noContent)
      .json({ message: MESSAGES.updated });
  } catch (error) {
    next(createError(error.statusCode, error.message));
  }
};

module.exports = {
  storeMessage,
  deleteMessage,
  updateMessage,
};
