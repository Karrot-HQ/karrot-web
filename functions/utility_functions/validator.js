const validator = require("../node_modules/validator");

const validateEmail = (input) => {
  const res = validator.isEmail(input.toString());
  return res;
};

const validateDate = (input) => {
  const res = validator.isDate(input);
  return res;
};

const validateInt = (input) => {
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

const validateAlpha = (input) => {
  const res = validator.isAlpha(input);
  return res;
};

const validateNumeric = (input) => {
  const res = validator.isNumeric(input);
  return res;
};

const validateAscii = (input) => {
  const res = validator.isAscii(input);
  return res;
};

const validateMobilePhone = (input) => {
  const res = validator.isMobilePhone(input, [{strictMode: true}]);
  return res;
};

const validateStrongPassword = (input) => {
  const res = validator.isStrongPassword(input);
  return res;
};

module.exports = {
  validateEmail,
  validateDate,
  validateInt,
  validateBoolean,
  validateAlphaNumeric,
  validateAlpha,
  validateNumeric,
  validateAscii,
  validateMobilePhone,
  validateStrongPassword,
};
