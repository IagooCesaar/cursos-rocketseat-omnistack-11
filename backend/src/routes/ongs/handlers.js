const boom = require("boom");

const db = require("../../database/knex");
const repoOngs = require("../../repositories/ongs.repository");

const hash = require("../../utils/hash");
const { ERR_ONGS_DUPLICATE_EMAIL } = require("../../utils/errorTypes");

const canLog = process.env.CAN_LOG || false === true;

const create = async (req, h) => {
  try {
    let { name, email, password, whatsapp, city, uf } = req.payload;

    email = email.toLowerCase();
    const existingOng = await repoOngs.findByEmail(email);

    if (existingOng && existingOng.length === 1) {
      delete existingOng.password;
      return existingOng;
    }

    if (canLog) console.log("==> Cadastrando a nova ONG");
    password = await hash.make(password);
    const [id] = await db("ongs").insert({
      name,
      email,
      password,
      whatsapp,
      city,
      uf,
    });
    const result = await repoOngs.findByID(id);

    delete result.password;
    return result;
  } catch (error) {
    switch (error.messsage) {
      case ERR_ONGS_DUPLICATE_EMAIL:
        throw boom.badData("Já existe uma ONG cadastrada com este e-mail");
    }
  }
};

const index = async (req, h) => {
  try {
    const ongs = await db("ongs").select("*");

    return ongs;
  } catch (error) {}
};

const show = async (req, h) => {
  const { id } = req.params;
  const result = await repoOngs.findByID(id);
  return result;
};

const update = async (req, h) => {};

module.exports = {
  create,
  index,
  show,
  update,
};
