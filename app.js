const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const hbs = require("hbs");
const FileStore = require("session-file-store")(session);
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger");

const indexRouter = require("./src/routes/index");
const usersRouter = require("./src/routes/user-routes");

const { setupDB } = require("./src/models/user-model");

var app = express();

hbs.registerPartials(
  path.join(__dirname, "handlebars/views/partials"),
  (err) => {
    console.log("Error : ", err);
  }
);
app.set("views", path.join(__dirname, "handlebars/views"));
app.set("view engine", "hbs");

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

app.use("/", indexRouter);
app.use("/users", usersRouter);

// Setup for database
(async function () {
  await setupDB();
})();

module.exports = app;
