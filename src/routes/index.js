var express = require("express");
var router = express.Router();
const JSONdb = require("simple-json-db");
const { param } = require("express-validator");
const createError = require("http-errors");

const { retriveUserDB } = require("../models/user-model");
const { isAuthenticated } = require("../middleware/auth-middleware");
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
        gender,
        password,
      };

      return res.render("edit", { title: "update user", userData });
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
