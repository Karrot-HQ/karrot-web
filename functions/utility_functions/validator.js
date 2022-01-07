const validator = require("../node_modules/validator");

const validateEmail = (input) => {
  const res = validator.isEmail(input.toString());
  return res;
};

const validateDate = (input) => {
  const res = validator.isDate(input);
  return res;
};

const validateId = (input) => {
  const res = validator.isInt(input.toString(), [{min: 1}]);
  return res;
};

const validateBoolean = (input) => {
  const res = validator.isBoolean(input.toString());
  return res;
};

const validateAlphaNumeric = (input) => {
  const res = validator.isAlphanumeric(input);
  return res;
};

module.exports = {
  validateEmail,
  validateDate,
  validateId,
  validateBoolean,
  validateAlphaNumeric,
};
