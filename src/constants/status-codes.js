const STATUS_CODES = {
  userRegistered: 201,
  userExists: 409,
  noResource: 404,
  internalError: 500,
  success: 200,
  unAuthenticated: 401,
  badRequest: 400,
  noContent: 204,
  messageAdded: 201,
};

module.exports = STATUS_CODES;
