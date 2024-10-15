const { Sequelize, DataTypes } = require("sequelize");
const { customAlphabet } = require("nanoid");
const path = require("path");
const bcrypt = require("bcrypt");
const createError = require("http-errors");

const nanoid = customAlphabet("1234567890", 18);
const saltRounds = 10;

const STATUS_CODES = require("../constants/status-codes");
const MESSAGES = require("../constants/messages");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../database", "users.sqlite3"),
});

const UserSchema = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.ENUM("M", "F", "O"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

async function checkIfExistsInDB(mobile) {
  try {
    const user = await UserSchema.findOne({
      where: {
        mobile: mobile,
      },
    });

    return user ? user : false;
  } catch (error) {
    console.log("Errrooroor: ", error);
    throw new Error("Error while checking for user in DB");
  }
}

async function storeUserToDB(body) {
  try {
    const userID = nanoid();
    const hashed = await bcrypt.hash(body.password, saltRounds);

    await UserSchema.create({
      id: userID,
      ...body,
      hashed,
    });

    return userID;
  } catch (error) {
    throw new Error("Error while storing user to DB");
  }
}

async function loginUserDB(mobile, password) {
  try {
    const { hashed, id } = await UserSchema.findOne({
      where: {
        mobile,
      },
    });

    if (!hashed) return false;

    const isMatch = await bcrypt.compare(password, hashed);

    return isMatch ? id : false;
  } catch (err) {
    throw new Error("Error while logging in user");
  }
}

async function deleteUserDB(userID) {
  try {
    const result = await UserSchema.destroy({
      where: {
        id: userID,
      },
    });

    if (result === 0) {
      throw createError(STATUS_CODES.noResource, MESSAGES.noResource);
    } else {
      return true;
    }
  } catch (err) {
    throw createError(err.statusCode, err.message);
  }
}

async function updateUserDB(updatedData, userID) {
  try {
    const hashed = await bcrypt.hash(updatedData.password, saltRounds);

    const result = await UserSchema.update(
      { ...updatedData, hashed },
      {
        where: {
          id: userID,
        },
      }
    );

    if (result[0] === 0) {
      throw createError(STATUS_CODES.noResource, MESSAGES.noResource);
    }

    return true;
  } catch (err) {
    throw createError(err.statusCode, err.message);
  }
}

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
  checkIfExistsInDB,
  storeUserToDB,
  loginUserDB,
  deleteUserDB,
  updateUserDB,
  setupDB,
};
