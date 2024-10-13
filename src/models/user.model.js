const JSONdb = require('simple-json-db');
const DB_URL = './src/database/storage.db';
const db = new JSONdb(DB_URL, {
	asyncWrite: false,
});

async function checkIfExistsInDB() {
	try {
	} catch (error) {}
}
