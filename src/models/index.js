const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../database", "users.sqlite3"),
});

async function setupDB() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB!!");

    await sequelize.sync({ force: false });
    console.log("Database & tables created!");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
}

module.exports = {
  sequelize,
  setupDB,
};
