var express = require("express");
var router = express.Router();
const JSONdb = require("simple-json-db");
const fs = require("fs");

const { isAuthenticated } = require("../middleware/auth-middleware");

router.get("/register", function (req, res, next) {
  return res.render("register", { title: "Register" });
});

router.get("/login", function (req, res, next) {
  return res.render("login", { title: "login" });
});

router.get("/view", isAuthenticated, function (req, res, next) {
  try {
    const raw = JSON.parse(
      fs.readFileSync(`${__dirname}/../database/storage.json`, "utf8")
    );

    const worked = Object.values(raw).map((item) => JSON.parse(item));

    return res.render("view", { title: "view users", worked });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/edit/:name", isAuthenticated, function (req, res, next) {
  try {
    const db = new JSONdb("./src/database/storage.json");

    if (!db.has(req.params.name)) {
      return res.render("error", {
        title: "error page",
        message: "No user found",
      });
    }

    const { dob, name, gender } = JSON.parse(db.get(req.params.name));

    const dt = new Date(dob);
    const year = dt.getFullYear();
    let month = dt.getMonth() + 1; // month is zero-based
    let day = dt.getDate();

    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;

    const tempDate = `${year}-${month}-${day}`;

    console.log("tempDate: ", tempDate);

    const dobArr = dob.split("-");
    const data = {
      dob: tempDate,
      name,
      gender,
    };

    return res.render("edit", { title: "update user", data });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
