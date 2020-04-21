const db = require("../database/knex");
const Cache = require("./cache.repository");
const { LOGIN_EXPIRATION_MINUTES } = require("../auth/config");

const canLog = process.env.CAN_LOG || false === true;

const prefixoCache = "ongID:";

const setCache = (ong) =>
  Cache.set(
    `${prefixoCache}${ong.id}`,
    JSON.stringify(ong),
    LOGIN_EXPIRATION_MINUTES * 60
  );

const removeCache = (ongID) => Cache.del(`${prefixoCache}${ongID}`);

const existingCache = (ongID) => {
  return Cache.exists(`${prefixoCache}${ongID}`);
};

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
  setCache,
  removeCache,
  existingCache,
};
