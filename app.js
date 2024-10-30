const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const FileStore = require("session-file-store")(session);
const swaggerUi = require("swagger-ui-express");
const hbs = require("hbs");
const swaggerDocs = require("./swagger");

const hbsRouter = require("./src/routes/hbs-routes");
const usersRouter = require("./src/routes/user-routes");
const messageRouter = require("./src/routes/message-routes");

const { setupDB } = require("./src/models");

var app = express();

app.set("views", path.join(__dirname, "handlebars/views"));
app.set("view engine", "hbs");
// Register the `eq` helper
hbs.registerHelper("eq", function (a, b) {
  return a === b;
});
hbs.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

app.use(
  session({
    store: new FileStore({
      path: path.join(__dirname, "/src/cache"),
      retries: 1,
      ttl: 86400,
    }),
    secret: "secret",
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
app.use(express.static(path.join(__dirname, "handlebars/public")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/hbs", hbsRouter);
app.use("/users", usersRouter);
app.use("/message", messageRouter);

// Setup for database
(async function () {
  await setupDB();
})();

module.exports = app;
