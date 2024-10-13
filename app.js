const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const FileStore = require('session-file-store')(session);

const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/user-routes');

var app = express();

hbs.registerPartials(
	path.join(__dirname, 'handlebars/views/partials'),
	(err) => {}
);
app.set('views', path.join(__dirname, 'handlebars/views'));
app.set('view engine', 'hbs');

app.use(
	session({
		store: new FileStore({
			path: path.join(__dirname, '/src/cache'),
			retries: 1,
			ttl: 86400,
		}),
		secret: 'secret',
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
		},
		resave: true,
		saveUninitialized: false,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'handlebars/public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;