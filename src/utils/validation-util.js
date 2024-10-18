const { checkSchema } = require("express-validator");

const name = {
  notEmpty: {
    errorMessage: "Name cannot be empty",
  },
  isString: {
    errorMessage: "Name must be a string",
  },
  isLength: {
    errorMessage: "name must have minimum of 2 charecters",
    options: { min: 2 },
  },
  trim: true,
};

const password = {
  notEmpty: {
    errorMessage: "Password cannot be empty",
  },
  isLength: {
    errorMessage: "Password must be at least 4 characters long",
    options: { min: 4 },
  },
};

const gender = {
  notEmpty: {
    errorMessage: "Gender cannot be empty",
  },
  isIn: {
    errorMessage: "Gender must be Male, Female, Other",
    options: [["M", "F", "O"]],
  },
};

const dob = {
  notEmpty: {
    errorMessage: "DOB cannot be empty",
  },
  isString: {
    errorMessage: "DOB must be a string",
  },
};

const email = {
  notEmpty: {
    errorMessage: "Email cannot be empty",
  },
  isEmail: {
    errorMessage: "Email must be a valid email address",
  },
  normalizeEmail: true,
};

const mobile = {
  notEmpty: {
    errorMessage: "Mobile number cannot be empty",
  },
  isMobilePhone: {
    errorMessage: "Mobile number must be valid",
    options: ["any"],
  },
  isLength: {
    errorMessage: "Mobile number must be exactly 10 digits",
    options: { min: 10, max: 10 },
  },
  trim: true,
};

const registerValidationSchema = checkSchema({
  name,
  password,
  gender,
  dob,
  email,
  mobile,
});

const updateValidationSchema = checkSchema({
  name,
  password,
  gender,
  dob,
  email,
  mobile,
});

const loginValidationSchema = checkSchema({
  mobile,
  password,
});

module.exports = {
  registerValidationSchema,
  updateValidationSchema,
  loginValidationSchema,
};
