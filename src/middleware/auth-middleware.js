const STATUS_CODES = require("../constants/status-codes");
const MESSAGES = require("../constants/messages");

const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res
      .status(STATUS_CODES.unAuthenticated)
      .json({ message: MESSAGES.unAuthenticated });
  } else {
    next();
  }
};

module.exports = { isAuthenticated };
