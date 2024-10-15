const { registerUser, loginUser } = require("../../controller/user-controller");
const {
  checkIfExistsInDB,
  storeUserToDB,
  loginUserDB,
  deleteUserDB,
  updateUserDB,
} = require("../../models/user-model");
const STATUS_CODES = require("../../constants/status-codes");
const MESSAGES = require("../../constants/messages");
const createError = require("http-errors");

jest.mock("../../models/user-model");
jest.mock("http-errors");

describe("user-controller", () => {
  let req, res, next;
  const error = new Error("Something went wrong");

  beforeAll(() => {
    req = {
      body: {
        name: "John Doe",
        dob: "16-01-1990",
        password: "1234",
        gender: "M",
        email: "john@gmail.com",
        mobile: "1234567890",
      },
      params: {
        userID: "274162874687126487126",
      },
      session: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe("registerUser", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should return 409 if user already exists", async () => {
      checkIfExistsInDB.mockResolvedValue(true);

      await registerUser(req, res, next);

      expect(checkIfExistsInDB).toHaveBeenCalledWith("1234567890");
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.userExists);
      expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.userExists });
    });

    test("should register a new user and return 201", async () => {
      checkIfExistsInDB.mockResolvedValue(false);
      storeUserToDB.mockResolvedValue("newUserID");

      await registerUser(req, res, next);

      expect(checkIfExistsInDB).toHaveBeenCalledWith("1234567890");
      expect(storeUserToDB).toHaveBeenCalledWith(req.body);
      expect(req.session.user).toEqual({
        userID: "newUserID",
        name: "John Doe",
      });
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.userRegistered);
      expect(res.json).toHaveBeenCalledWith({
        message: MESSAGES.userRegistered,
      });
    });

    test("should call next with an error if an exception occurs", async () => {
      checkIfExistsInDB.mockRejectedValue(error);

      await registerUser(req, res, next);

      expect(checkIfExistsInDB).toHaveBeenCalledWith("1234567890");
      expect(next).toHaveBeenCalledWith(
        createError(error.statusCode, error.message)
      );
    });
  });

  describe("loginUser", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should return 404 if no user exists", async () => {
      checkIfExistsInDB.mockResolvedValue(false);

      await registerUser(req, res, next);

      expect(checkIfExistsInDB).toHaveBeenCalledWith("1234567890");
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.noResource);
      expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.noResource });
    });
  });
});
