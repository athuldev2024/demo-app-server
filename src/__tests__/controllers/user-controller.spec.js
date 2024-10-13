const { registerUser } = require('../../controller/user-controller');

const STATUS_CODES = require('../../constants/status-codes');
const MESSAGES = require('../../constants/messages');

jest.mock('simple-json-db', () => {
	return jest.fn().mockImplementation(() => {
		return {
			has: jest.fn().mockImplementation((input) => {
				if (typeof input !== 'string') {
					throw new Error('Not a string');
				}
				if (input === 'no exists') {
					return true;
				}
				return false;
			}),
			set: jest.fn().mockReturnValue(true),
		};
	});
});

describe('registerUser', () => {
	let req, res, next;

	beforeEach(() => {
		req = {
			body: {
				name: 'no exists',
				dob: '16-01-1995',
				password: '1234',
				gender: 'M',
				email: 'athul@gmail.com',
				mobile: '1234567890',
			},
			session: {},
		};

		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		next = jest.fn().mockReturnThis();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return user exists if the user is already in the database', async () => {
		await registerUser(req, res, next);

		expect(res.status).toHaveBeenCalledWith(STATUS_CODES.userExists);
		expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.userExists });
	});

	it('should return user registered if the user is no there in the database', async () => {
		const { body, session } = req;
		await registerUser(
			{ body: { ...body, name: 'exists' }, session },
			res,
			next
		);

		expect(res.status).toHaveBeenCalledWith(STATUS_CODES.userRegistered);
		expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.userRegistered });
	});

	it('should call next function with Error if the user name is not a string', async () => {
		const { body, session } = req;
		await registerUser({ body: { ...body, name: 101 }, session }, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
	});
});
