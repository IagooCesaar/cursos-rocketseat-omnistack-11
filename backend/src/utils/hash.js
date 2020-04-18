const bcrypt = require("bcryptjs");

const make = async (value) => {
  return bcrypt.hash(value, 10);
};

const compare = (value, valueHash) => {
  return bcrypt.compare(value, valueHash);
};

module.exports = {
  make,
  compare,
};
