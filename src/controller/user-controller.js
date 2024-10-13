const JSONdb = require('simple-json-db');
const { customAlphabet } = require('nanoid');
const util = require('util');
const createError = require('http-errors');

const STATUS_CODES = require('../constants/status-codes');
const MESSAGES = require('../constants/messages');

const nanoid = customAlphabet('1234567890', 18);
const DB_URL = './src/database/storage.db';
const db = new JSONdb(DB_URL, {
	asyncWrite: false,
});

const registerUser = async (req, res, next) => {
	try {
		if (db.has(req.body.name)) {
			return res
				.status(STATUS_CODES.userExists)
				.json({ message: MESSAGES.userExists });
		}

		db.set(req.body.name, JSON.stringify(req.body));

		req.session.user = { userID: nanoid(), name: req.body.name };

		return res
			.status(STATUS_CODES.userRegistered)
			.json({ message: MESSAGES.userRegistered });
	} catch (error) {
		next(createError(error.statusCode, error.message));
	}
};

const loginUser = async (req, res, next) => {
	try {
		if (!db.has(req.body.name)) {
			return res
				.status(STATUS_CODES.noResource)
				.json({ message: MESSAGES.noResource });
		}

		const userFromDb = JSON.parse(db.get(req.body.name));

		if (userFromDb.password !== req.body.password) {
			return res
				.status(STATUS_CODES.unAuthenticated)
				.json({ message: MESSAGES.unAuthenticated });
		}

		// Setting the session
		req.session.user = { userID: nanoid(), name: req.body.name };

		return res
			.status(STATUS_CODES.success)
			.json({ message: MESSAGES.loginSuccess });
	} catch (error) {
		next(createError(error.statusCode, error.message));
	}
};

const logoutUser = async (req, res, next) => {
	try {
		const destroySession = util
			.promisify(req.session.destroy)
			.bind(req.session);
		await destroySession();

		res.clearCookie('connect.sid');

		return res
			.status(STATUS_CODES.success)
			.json({ message: MESSAGES.logoutSuccess });
	} catch (error) {
		next(createError(error.statusCode, error.message));
	}
};

const updateUser = async (req, res, next) => {
	try {
		if (!db.has(req.params.name)) {
			return res
				.status(STATUS_CODES.noResource)
				.json({ message: MESSAGES.noResource });
		}

		db.set(
			req.params.name,
			JSON.stringify({ ...JSON.parse(db.get(req.params.name)), ...req.body })
		);

		return res
			.status(STATUS_CODES.noContent)
			.json({ message: MESSAGES.updated });
	} catch (error) {
		next(createError(error.statusCode, error.message));
	}
};

const deleteUser = async (req, res, next) => {
	try {
		if (!db.has(req.params.name)) {
			return res
				.status(STATUS_CODES.noResource)
				.json({ message: MESSAGES.noResource });
		}

		const destroySession = util
			.promisify(req.session.destroy)
			.bind(req.session);
		await destroySession();

		res.clearCookie('connect.sid');

		db.delete(req.params.name);

		return res
			.status(STATUS_CODES.noContent)
			.json({ message: MESSAGES.deleted });
	} catch (error) {
		next(createError(error.statusCode, error.message));
	}
};

module.exports = {
	registerUser,
	loginUser,
	deleteUser,
	updateUser,
	logoutUser,
};
