const {
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  logoutUser,
} = require("../../controllers/user-controller");
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
const { promisify } = require("util");

jest.mock("util");
jest.mock("../../models/user-model");
jest.mock("http-errors");

describe("user-controller", () => {
  let req, res, next;
  const error = new Error("Something went wrong");

  beforeEach(() => {
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
        userID: "newUserID",
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

      await loginUser(req, res, next);

      expect(checkIfExistsInDB).toHaveBeenCalledWith("1234567890");
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.noResource);
      expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.noResource });
    });

    test("should return 401 if credentials are wrong", async () => {
      checkIfExistsInDB.mockResolvedValue(true);
      loginUserDB.mockResolvedValue(false);

      await loginUser(req, res, next);

      expect(checkIfExistsInDB).toHaveBeenCalledWith("1234567890");
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.unAuthenticated);
      expect(res.json).toHaveBeenCalledWith({
        message: MESSAGES.unAuthenticated,
      });
    });

    test("should return 200 if credentials are correct", async () => {
      checkIfExistsInDB.mockResolvedValue(true);
      loginUserDB.mockResolvedValue("274162874687126487126");

      await loginUser(req, res, next);

      expect(checkIfExistsInDB).toHaveBeenCalledWith("1234567890");
      expect(req.session.user).toEqual({
        userID: "274162874687126487126",
        name: "John Doe",
      });
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.success);
      expect(res.json).toHaveBeenCalledWith({
        message: MESSAGES.loginSuccess,
        userID: "274162874687126487126",
      });
    });

    test("should call next with an error if an exception occurs", async () => {
      checkIfExistsInDB.mockRejectedValue(error);

      await loginUser(req, res, next);

      expect(checkIfExistsInDB).toHaveBeenCalledWith("1234567890");
      expect(next).toHaveBeenCalledWith(
        createError(error.statusCode, error.message)
      );
    });
  });

  describe("deleteUser", () => {
    test("should delete user and return 204", async () => {
      deleteUserDB.mockResolvedValue(true);

      await deleteUser(req, res, next);

      expect(deleteUserDB).toHaveBeenCalledWith(req.params.userID);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.noContent);
      expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.deleted });
    });

    test("should call next with an error if delete fails", async () => {
      deleteUserDB.mockRejectedValue(error);

      await deleteUser(req, res, next);

      expect(deleteUserDB).toHaveBeenCalledWith(req.params.userID);
      expect(next).toHaveBeenCalledWith(
        createError(error.statusCode, error.message)
      );
    });
  });

  describe("updateUser", () => {
    test("should update user and return 204", async () => {
      updateUserDB.mockResolvedValue(true);

      await updateUser(req, res, next);

      expect(updateUserDB).toHaveBeenCalledWith(req.body, req.params.userID);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.noContent);
      expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.updated });
    });

    test("should call next with an error if update fails", async () => {
      updateUserDB.mockRejectedValue(error);

      await updateUser(req, res, next);

      expect(updateUserDB).toHaveBeenCalledWith(req.body, req.params.userID);
      expect(next).toHaveBeenCalledWith(
        createError(error.statusCode, error.message)
      );
    });
  });

  describe("logoutUser", () => {
    test("should successfully logout user and return 200", async () => {
      const destroySessionMock = jest.fn().mockResolvedValue();
      promisify.mockReturnValue(destroySessionMock);

      await logoutUser(req, res, next);

      expect(res.clearCookie).toHaveBeenCalledWith("connect.sid");
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.success);
      expect(res.json).toHaveBeenCalledWith({
        message: MESSAGES.logoutSuccess,
      });
    });

    test("should call next with an error if session destruction fails", async () => {
      const destroySessionMock = jest.fn().mockRejectedValue(error);
      promisify.mockReturnValue(destroySessionMock);

      await logoutUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        createError(error.statusCode, error.message)
      );
    });
  });
});
