const util = require("util");
const createError = require("http-errors");

const STATUS_CODES = require("../constants/status-codes");
const MESSAGES = require("../constants/messages");
const {
  checkIfExistsInDB,
  storeUserToDB,
  loginUserDB,
  deleteUserDB,
  updateUserDB,
} = require("../models/user-model");

const registerUser = async (req, res, next) => {
  try {
    if (await checkIfExistsInDB(req.body.mobile)) {
      return res
        .status(STATUS_CODES.userExists)
        .json({ message: MESSAGES.userExists });
    }

    const userID = await storeUserToDB(req.body);

    req.session.user = { userID, name: req.body.name };

    return res
      .status(STATUS_CODES.userRegistered)
      .json({ message: MESSAGES.userRegistered, userID });
  } catch (error) {
    next(createError(error.statusCode, error.message));
  }
};

const loginUser = async (req, res, next) => {
  try {
    if (!(await checkIfExistsInDB(req.body.mobile))) {
      return res
        .status(STATUS_CODES.noResource)
        .json({ message: MESSAGES.noResource });
    }

    const userID = await loginUserDB(req.body.mobile, req.body.password);

    if (!userID) {
      return res
        .status(STATUS_CODES.unAuthenticated)
        .json({ message: MESSAGES.unAuthenticated });
    }

    req.session.user = { userID, name: req.body.name };

    return res
      .status(STATUS_CODES.success)
      .json({ message: MESSAGES.loginSuccess, userID });
  } catch (error) {
    next(createError(error.statusCode, error.message));
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const destroySession = util
      .promisify(req.session.destroy)
      .bind(req.session);
    await destroySession();

    res.clearCookie("connect.sid");

    return res
      .status(STATUS_CODES.success)
      .json({ message: MESSAGES.logoutSuccess });
  } catch (error) {
    next(createError(error.statusCode, error.message));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await deleteUserDB(req.params.userID);

    return res
      .status(STATUS_CODES.noContent)
      .json({ message: MESSAGES.deleted });
  } catch (error) {
    next(createError(error.statusCode, error.message));
  }
};

const updateUser = async (req, res, next) => {
  try {
    await updateUserDB(req.body, req.params.userID);

    return res
      .status(STATUS_CODES.noContent)
      .json({ message: MESSAGES.updated });
  } catch (error) {
    next(createError(error.statusCode, error.message));
  }
};

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  logoutUser,
};
