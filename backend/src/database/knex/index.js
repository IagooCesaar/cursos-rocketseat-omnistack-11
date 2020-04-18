const knex = require("knex");
const knexConfig = require("../../../knexfile");

const canLog = process.env.CAN_LOG || false === true;

let config = null;

const getConfig = () => {
  switch (process.env.NODE_ENV) {
    case "test":
      config = knexConfig.test;
      return;
    case "prod":
      config = knexConfig.production;
      return;
    case "staging":
      config = knexConfig.staging;
      return;
    default:
      config = knexConfig.dev;
      return;
  }
};
getConfig();

const connection = knex(config);

module.exports = connection;
