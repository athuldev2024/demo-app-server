const { Router } = require('express');
const { body, param } = require('express-validator');
const {
	registerUser,
	loginUser,
	deleteUser,
	updateUser,
	logoutUser,
} = require('../controller/user-controller');
const {
	checkRequestValidation,
	commonErrorHandler,
} = require('../middleware/error-middleware');
const {
	registerValidationSchema,
	updateValidationSchema,
} = require('../utils/validation-util');

const { isAuthenticated } = require('../middleware/auth-middleware');

const router = Router();

router.post(
	'/register',
	registerValidationSchema,
	checkRequestValidation,
	(req, res, next) => registerUser(req, res, next)
);
router.post(
	'/login',
	[body('name').isString().notEmpty(), body('password').isString().notEmpty()],
	checkRequestValidation,
	(req, res, next) => loginUser(req, res, next)
);
router.get('/logout', (req, res, next) => logoutUser(req, res, next));

router.use(isAuthenticated);

router.patch(
	'/update/:name',
	[param('name').isString().notEmpty()],
	updateValidationSchema,
	checkRequestValidation,
	(req, res, next) => updateUser(req, res, next)
);

router.delete(
	'/delete/:name',
	[param('name').isString().notEmpty()],
	checkRequestValidation,
	(req, res, next) => deleteUser(req, res, next)
);

router.use((error, req, res, next) =>
	commonErrorHandler(error, req, res, next)
);

module.exports = router;
