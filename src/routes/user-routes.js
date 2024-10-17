const { Router } = require("express");
const { body, param } = require("express-validator");
const {
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  logoutUser,
} = require("../controllers/user-controller");
const {
  checkRequestValidation,
  commonErrorHandler,
} = require("../middleware/error-middleware");
const {
  registerValidationSchema,
  updateValidationSchema,
} = require("../utils/validation-util");

const { isAuthenticated } = require("../middleware/auth-middleware");

const router = Router();

router.post(
  "/register",
  registerValidationSchema,
  checkRequestValidation,
  (req, res, next) => registerUser(req, res, next)
);
router.post(
  "/login",
  [
    body("mobile")
      .isString()
      .withMessage("Mobile number must be a string")
      .notEmpty()
      .withMessage("Mobile number is required")
      .isLength({ min: 10, max: 10 })
      .withMessage("Mobile number must be exactly 10 digits long")
      .isMobilePhone("any")
      .withMessage("Please provide a valid mobile number"),
    body("password").isString().notEmpty(),
  ],
  checkRequestValidation,
  (req, res, next) => loginUser(req, res, next)
);
router.get("/logout", (req, res, next) => logoutUser(req, res, next));

router.use(isAuthenticated);

router.patch(
  "/update/:userID",
  [param("userID").isString().notEmpty()],
  updateValidationSchema,
  checkRequestValidation,
  (req, res, next) => updateUser(req, res, next)
);

router.delete(
  "/delete/:userID",
  [param("userID").isString().notEmpty()],
  checkRequestValidation,
  (req, res, next) => deleteUser(req, res, next)
);

router.use((error, req, res, next) =>
  commonErrorHandler(error, req, res, next)
);

module.exports = router;
