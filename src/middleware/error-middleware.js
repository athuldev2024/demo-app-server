const { validationResult } = require('express-validator');
const createError = require('http-errors');

const STATUS_CODES = require('../constants/status-codes');

const checkRequestValidation = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(STATUS_CODES.badRequest).json({ errors: errors.array() });
	}
	next();
};

function commonErrorHandler(error, req, res, next) {
	const statusCode = error.statusCode || 500;
	const message = error.message || 'Internal Server Error';

	return res.status(statusCode).json({ message });
}

module.exports = {
	checkRequestValidation,
	commonErrorHandler,
};
