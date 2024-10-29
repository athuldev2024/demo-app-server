const { DataTypes, Op } = require("sequelize");
const { customAlphabet } = require("nanoid");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const { sequelize } = require("./index");

const nanoid = customAlphabet("1234567890", 18);
const saltRounds = 10;

const STATUS_CODES = require("../constants/status-codes");
const MESSAGES = require("../constants/messages");

const UserSchema = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING,
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
  } catch (err) {
    throw createError(err.statusCode, err.message);
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
  } catch (err) {
    throw createError(err.statusCode, err.message);
  }
}

async function loginUserDB(mobile, password) {
  try {
    const { id, hashed } = await UserSchema.findOne({
      where: {
        mobile,
      },
    });

    if (!hashed) return false;

    const isMatch = await bcrypt.compare(password, hashed);

    return isMatch ? id : false;
  } catch (err) {
    throw createError(err.statusCode, err.message);
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

async function retriveUserDB(userID) {
  try {
    const { id, name, mobile, email, dob, gender, password } =
      await UserSchema.findOne({
        where: {
          id: userID,
        },
      });

    if (!id) {
      throw createError(STATUS_CODES.noResource, MESSAGES.noResource);
    }

    return { id, name, mobile, email, dob, gender, password };
  } catch (err) {
    throw createError(err.statusCode, err.message);
  }
}

async function retriveOtherUsersDB(userID) {
  try {
    const otherUsers = await UserSchema.findAll({
      where: {
        id: {
          [Op.ne]: userID,
        },
      },
    });

    return otherUsers;
  } catch (err) {
    throw createError(err.statusCode, err.message);
  }
}

module.exports = {
  checkIfExistsInDB,
  storeUserToDB,
  loginUserDB,
  deleteUserDB,
  updateUserDB,
  retriveUserDB,
  retriveOtherUsersDB,
};
