const boom = require("boom");

const db = require("../../database/knex");
const repoOngs = require("../../repositories/ongs.repository");

const hash = require("../../utils/hash");
const { ERR_ONGS_DUPLICATE_EMAIL } = require("../../utils/errorTypes");

const canLog = process.env.CAN_LOG || false === true;

const getAll = async (req, h) => {
  const { page = 1 } = req.query;
  const itensPerPage = 5;

  const [count] = await db("incidents").count();

  const incidents = await db("incidents")
    .join("ongs", "ongs.id", "=", "incidents.ong_id")
    .limit(itensPerPage)
    .offset((page - 1) * itensPerPage)
    .select([
      "incidents.*",
      "ongs.name",
      "ongs.email",
      "ongs.whatsapp",
      "ongs.city",
      "ongs.uf",
    ]);

  const response = h.response(incidents);
  response.header("X-Total-Count", count["count(*)"]);
  response.header("X-Itens-Per-Page", itensPerPage);
  return response;
};

const create = async (req, h) => {
  const { ongID } = req.params;
  const { credentials, artifacts } = req.auth;

  if (ongID !== credentials.data.ongID) {
    return boom.forbidden("Você não poderá criar casos para outras ONGs");
  }

  const { title, description, value } = req.payload;

  const [id] = await db("incidents").insert({
    title,
    description,
    value,
    ong_id: ongID,
  });

  return h.response({ incidentID: id }).code(201);
};

module.exports = {
  getAll,
  create,
};
