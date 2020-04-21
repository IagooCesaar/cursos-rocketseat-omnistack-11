const Joi = require("@hapi/joi");

const { ALGORITHM } = require("./config");
const repoOngs = require("../repositories/ongs.repository");
const Token = require("./token.auth");

const headersScheme = Joi.object({
  authorization: Joi.string().required(),
}).unknown();

const validate = async (decoded, request, h) => {
  const { token } = request.auth;
  const exists = await repoOngs.existingCache(decoded.data.ongID);
  const invalidated = await Token.hasInvalidated(token);
  return {
    isValid: exists || !invalidated,
  };
};

const strategies = [
  {
    default: true,
    headersScheme,
    name: "jwt",
    scheme: "jwt",
    options: {
      key: process.env.JWT_KEY,
      validate,
      verifyOptions: {
        algorithms: [ALGORITHM],
      },
    },
  },
  {
    default: false,
    headersScheme,
    name: "2fa",
    scheme: "jwt",
    options: {
      key: process.env.JWT_KEY,
      validate,
      verifyOptions: {
        algorithms: [ALGORITHM],
      },
    },
  },
];

const findByName = (name) =>
  strategies.filter((strategy) => strategy.name === name)[0];

const getDefault = () =>
  strategies.filter((strategy) => strategy.default === true)[0];

module.exports = {
  strategies,
  findByName,
  getDefault,
};
