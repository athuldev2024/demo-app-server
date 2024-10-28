const { Router } = require("express");
const { param, body } = require("express-validator");

const {
  storeMessage,
  deleteMessage,
  updateMessage,
} = require("../controllers/message-controller");
const { messageValidationSchema } = require("../utils/validation-util");

const {
  checkRequestValidation,
  commonErrorHandler,
} = require("../middleware/error-middleware");

const { isAuthenticated } = require("../middleware/auth-middleware");

const router = Router();

router.use(isAuthenticated);

/**
 * @swagger
 * /message/ping:
 *   post:
 *     tags:
 *        - Message
 *     summary: Ping a new message
 *     description: Update user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *                 description: Unique ID of sender.
 *                 example: "848692338156185698"
 *               receiver:
 *                 type: string
 *                 description: Unique ID of receiver.
 *                 example: "848692338156185698"
 *               message:
 *                 type: string
 *                 description: Message.
 *                 example: "Hello world, How are you?"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/ping",
  messageValidationSchema,
  checkRequestValidation,
  (req, res, next) => storeMessage(req, res, next)
);

/**
 * @swagger
 * /message/delete/{messageID}:
 *   delete:
 *     tags:
 *        - Message
 *     summary: Delete message
 *     description: Delete message in the system.
 *     parameters:
 *       - in: path
 *         name: messageID
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
  "/delete/:messageID",
  [param("messageID").isString().notEmpty()],
  checkRequestValidation,
  (req, res, next) => deleteMessage(req, res, next)
);

/**
 * @swagger
 * /message/update/{messageID}:
 *   patch:
 *     tags:
 *        - Message
 *     summary: Update message
 *     description: Update message in the system.
 *     parameters:
 *       - in: path
 *         name: messageID
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
 *               message:
 *                 type: string
 *                 description: Message from user.
 *                 example: "Hi john"
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
  "/update/:messageID",
  [param("messageID").isString().notEmpty()],
  [body("message").isString().notEmpty()],
  checkRequestValidation,
  (req, res, next) => updateMessage(req, res, next)
);

router.use((error, req, res, next) =>
  commonErrorHandler(error, req, res, next)
);

module.exports = router;
