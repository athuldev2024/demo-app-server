const {
  storeMessage,
  deleteMessage,
} = require("../../controllers/message-controller");
const {
  storeMessageToDB,
  deleteMessageDB,
} = require("../../models/message-model");
const STATUS_CODES = require("../../constants/status-codes");
const MESSAGES = require("../../constants/messages");
const createError = require("http-errors");

jest.mock("../../models/message-model");
jest.mock("http-errors");

describe("message-controller", () => {
  let req, res, next;
  const messageID = "newMessageID";
  const error = new Error("Something went wrong");

  beforeEach(() => {
    req = {
      body: {
        sender: "848692338156185698",
        receiver: "848692338156185698",
        message: "Hello world, How are you?",
      },
      params: {
        messageID,
      },
      session: {
        destroy: jest.fn(),
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn(),
    };

    next = jest.fn();
  });

  describe("storeMessage", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should register a new message and return 201", async () => {
      storeMessageToDB.mockResolvedValue(messageID);

      await storeMessage(req, res, next);

      expect(storeMessageToDB).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.messageAdded);
      expect(res.json).toHaveBeenCalledWith({
        message: MESSAGES.messageAdded,
        messageID,
      });
    });

    test("should call next with an error if an exception occurs", async () => {
      storeMessageToDB.mockRejectedValue(error);

      await storeMessage(req, res, next);

      expect(storeMessageToDB).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith(
        createError(error.statusCode, error.message)
      );
    });
  });

  describe("deleteMessage", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should delete message and return 204", async () => {
      deleteMessageDB.mockResolvedValue(10);

      await deleteMessage(req, res, next);

      expect(deleteMessageDB).toHaveBeenCalledWith(req.params.messageID);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.noContent);
      expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.deleted });
    });

    test("should call next with an error if an exception occurs", async () => {
      deleteMessageDB.mockRejectedValue(error);

      await deleteMessage(req, res, next);

      expect(deleteMessageDB).toHaveBeenCalledWith(req.params.messageID);
      expect(next).toHaveBeenCalledWith(
        createError(error.statusCode, error.message)
      );
    });
  });
});
