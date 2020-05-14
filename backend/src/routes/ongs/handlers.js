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
    if (existingOng && existingOng.length >= 1) {
      throw new Error(ERR_ONGS_DUPLICATE_EMAIL);
    }

    password = await hash.make(password);
    const [id] = await db("ongs")
      .insert({
        name,
        email,
        password,
        whatsapp,
        city,
        uf,
      })
      .returning("id");

    const result = await repoOngs.findByID(id);

    delete result.password;

    return h.response(result).code(201);
  } catch (error) {
    switch (error.message) {
      case ERR_ONGS_DUPLICATE_EMAIL:
        throw boom.badData("Já existe uma ONG cadastrada com este e-mail");
      default:
        throw boom.badImplementation(error);
    }
  }
};

const index = async (req, h) => {
  const { email } = req.query;
  try {
    let ongs = [];
    if (!email) {
      ongs = await db("ongs")
        .where("active", true)
        .select("id", "name", "email", "whatsapp", "city", "uf", "active");
    } else {
      ongs = await db("ongs")
        .where({
          active: true,
          email: email.toLowerCase(),
        })
        .select("id", "name", "email", "whatsapp", "city", "uf", "active");
    }

    return ongs;
  } catch (error) {}
};

const show = async (req, h) => {
  const { id } = req.params;
  const result = await repoOngs.findByID(id);
  return result;
};

const update = async (req, h) => {
  try {
    const { id } = req.params;
    const dados = req.payload;
    delete dados.id;

    const [existingOng] = await repoOngs.findByID(id);
    if (!existingOng) {
      return boom.preconditionFailed(
        "Não foi possível encontrar uma ONG com o ID fornecido "
      );
    }
    if (dados.email) {
      const existingOngEmail = await repoOngs.findByEmail(dados.email);
      if (existingOngEmail.length > 0) {
        const diffOng = existingOngEmail.filter((ong) => ong.id !== id);
        if (diffOng.length > 0) {
          return boom.badRequest(
            `Não será possível alterar o e-mail da ONG pois o mesmo está em uso por outra entidade (${JSON.stringify(
              diffOng
            )})`
          );
        }
      }
    }

    const newOng = {
      ...existingOng,
      ...dados,
    };

    await db("ongs")
      .where({ id: id })
      .update({ ...newOng });

    const result = await repoOngs.findByID(id);

    return result;
  } catch (error) {
    boom.badData(error.messsage);
  }
};

const deleteOne = async (req, h) => {
  try {
    const { id } = req.params;

    const [existingOng] = await repoOngs.findByID(id);
    if (!existingOng) {
      return boom.preconditionFailed(
        "Não foi possível encontrar uma ONG com o ID fornecido "
      );
    }

    await db("ongs").where({ id: id }).update({ active: false });

    const result = await repoOngs.findByID(id);

    return {
      result,
      message: "Não é permitido deletar ONGs. O registro foi desativado",
    };
  } catch (error) {
    boom.badData(error.messsage);
  }
};

module.exports = {
  create,
  index,
  show,
  update,
  deleteOne,
};
