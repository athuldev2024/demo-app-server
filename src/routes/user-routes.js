const { Router } = require("express");
const { param } = require("express-validator");
const {
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  logoutUser,
  getOtherUsers,
} = require("../controllers/user-controller");
const {
  checkRequestValidation,
  commonErrorHandler,
} = require("../middleware/error-middleware");
const {
  registerValidationSchema,
  updateValidationSchema,
  loginValidationSchema,
} = require("../utils/validation-util");

const { isAuthenticated } = require("../middleware/auth-middleware");

const router = Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *        - User
 *     summary: Register a new user
 *     description: Registers a new user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *                 example: "John Doe"
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: "password123"
 *               gender:
 *                 type: string
 *                 description: Gender (M, F, O).
 *                 example: "M"
 *               dob:
 *                 type: string
 *                 description: Date of Birth.
 *                 example: "1990-01-01"
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: "john.doe@example.com"
 *               mobile:
 *                 type: string
 *                 description: Mobile number.
 *                 example: "1234567890"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       409:
 *         description: User already exists.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/register",
  registerValidationSchema,
  checkRequestValidation,
  (req, res, next) => registerUser(req, res, next)
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *        - User
 *     summary: Login user
 *     description: User login by checking in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *                 description: Mobile number.
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User login successfully.
 *       404:
 *         description: User does not exists.
 *       401:
 *         description: Authentication failed.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/login",
  loginValidationSchema,
  checkRequestValidation,
  (req, res, next) => loginUser(req, res, next)
);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     tags:
 *        - User
 *     summary: Logout user
 *     description: User logout in the system.
 *     responses:
 *       200:
 *         description: User logout successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/logout", (req, res, next) => logoutUser(req, res, next));

router.use(isAuthenticated);

/**
 * @swagger
 * /users/update/{userID}:
 *   patch:
 *     tags:
 *        - User
 *     summary: Update user
 *     description: Update user in the system.
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user.
 *         example: "848692338156185698"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *                 example: "John Doe"
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: "password123"
 *               gender:
 *                 type: string
 *                 description: Gender (M, F, O).
 *                 example: "M"
 *               dob:
 *                 type: string
 *                 description: Date of Birth.
 *                 example: "1990-01-01"
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: "john.doe@example.com"
 *               mobile:
 *                 type: string
 *                 description: Mobile number.
 *                 example: "1234567890"
 *     responses:
 *       204:
 *         description: User updated successfully.
 *       404:
 *         description: User does not exists.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
router.patch(
  "/update/:userID",
  [param("userID").isString().notEmpty()],
  updateValidationSchema,
  checkRequestValidation,
  (req, res, next) => updateUser(req, res, next)
);

/**
 * @swagger
 * /users/delete/{userID}:
 *   delete:
 *     tags:
 *        - User
 *     summary: Delete user
 *     description: Delete user in the system.
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user.
 *         example: "848692338156185698"
 *     responses:
 *       204:
 *         description: User updated successfully.
 *       404:
 *         description: User does not exists.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
router.delete(
  "/delete/:userID",
  [param("userID").isString().notEmpty()],
  checkRequestValidation,
  (req, res, next) => deleteUser(req, res, next)
);

/**
 * @swagger
 * /users/others/{userID}:
 *   get:
 *     tags:
 *        - User
 *     summary: Get other users
 *     description: get other users in the system expect me.
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user.
 *         example: "848692338156185698"
 *     responses:
 *       200:
 *         description: Got other users with success.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/others/:userID",
  [param("userID").isString().notEmpty()],
  checkRequestValidation,
  (req, res, next) => getOtherUsers(req, res, next)
);

router.use((error, req, res, next) =>
  commonErrorHandler(error, req, res, next)
);

module.exports = router;
