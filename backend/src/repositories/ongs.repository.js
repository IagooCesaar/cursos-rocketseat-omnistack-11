const db = require("../database/knex");

const canLog = process.env.CAN_LOG || false === true;

const findByID = async (ID) => {
  const result = await db("ongs")
    .where("id", ID)
    .select("id", "name", "email", "whatsapp", "city", "uf", "active");

  return result;
};

const findByEmail = async (email) => {
  const result = await db("ongs")
    .where("email", email.toLowerCase())
    // .select("id", "name", "email", "whatsapp", "city", "uf");
    .select("*");
  return result;
};

module.exports = {
  findByID,
  findByEmail,
};
