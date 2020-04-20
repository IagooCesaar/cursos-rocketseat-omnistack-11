const Joi = require("@hapi/joi");

const { ALGORITHM } = require("./config");

const headersScheme = Joi.object({
  authorization: Joi.string().required(),
}).unknown();

const strategies = [
  {
    default: true,
    headersScheme,
    name: "jwt",
    scheme: "jwt",
    options: {
      key: process.env.JWT_KEY,
      validate: async (decoded, request, h) => {
        console.log("Dados do token => ", decoded);
        return {
          isValid: true,
        };
      },
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
      validate: async (decoded, request, h) => {
        console.log("Dados do token => ", decoded);
        return {
          isValid: true,
        };
      },
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
