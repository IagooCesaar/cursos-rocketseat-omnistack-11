const db = require("../database/knex");

const canLog = process.env.CAN_LOG || false === true;

const findByID = async (ID) => {
  const result = await db("ongs").where("id", ID).select("*");

  return result;
};

const findByEmail = async (email) => {
  const result = await db("ongs")
    .where("email", email.toLowerCase())
    .select("*");
  return result;
};

module.exports = {
  findByID,
  findByEmail,
};