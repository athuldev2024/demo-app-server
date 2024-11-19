var express = require("express");
var router = express.Router();
const { param } = require("express-validator");
const createError = require("http-errors");

const { retriveUserDB } = require("../models/user-model");
const { getAllMessagesDB } = require("../models/message-model");
const { checkRequestValidation } = require("../middleware/error-middleware");

router.get("/register", function (req, res) {
  return res.render("register", { title: "Register" });
});

router.get("/login", function (req, res) {
  return res.render("login", { title: "login" });
});

router.get(
  "/view/:userID",
  [param("userID").isString().notEmpty()],
  checkRequestValidation,
  async function (req, res, next) {
    try {
      const userData = await retriveUserDB(req.params.userID);

      // Mobile application!!
      const acceptHeader = req.headers["accept"];
      if (acceptHeader && acceptHeader.includes("application/json")) {
        console.log("asdasf");
        return res.json({
          title: "View User",
          userData: userData,
        });
      }

      return res.render("view", {
        title: "view users",
        userData: userData,
      });
    } catch (error) {
      console.log("Error: ", error);
      next(createError(error.statusCode, error.message));
    }
  }
);

router.get(
  "/edit/:userID",
  [param("userID").isString().notEmpty()],
  checkRequestValidation,
  async function (req, res) {
    try {
      const { dob, name, mobile, email, gender, password } =
        await retriveUserDB(req.params.userID);

      const userData = {
        dob,
        name,
        mobile,
        email,
        password,
        gender,
      };

      return res.render("edit", { title: "update user", userData });
    } catch (error) {
      console.log("Error: ", error);
      next(createError(error.statusCode, error.message));
    }
  }
);

router.get(
  "/message/:userID/:otherUserID",
  [
    param("userID").isString().notEmpty(),
    param("otherUserID").isString().notEmpty(),
  ],
  checkRequestValidation,
  async function (req, res, next) {
    try {
      const allMessages = await getAllMessagesDB(
        req.params.userID,
        req.params.otherUserID
      );

      return res.render("message", {
        title: "See all messages",
        allMessages,
        tempMessages: [],
      });
    } catch (error) {
      console.log("Error: ", error);
      next(createError(error.statusCode, error.message));
    }
  }
);

router.use((req, res) => {
  return res.render("error", { message: "Wrong route!!!!" });
});

module.exports = router;
