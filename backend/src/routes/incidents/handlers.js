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
    .where("incidents.active", true)
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
  const { credentials } = req.auth;

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

const index = async (req, h) => {
  const { ongID } = req.params;
  const { credentials } = req.auth;

  if (ongID !== credentials.data.ongID) {
    return boom.forbidden("Você não poderá listar casos de outras ONGs");
  }

  const { page = 1 } = req.query;
  const itensPerPage = 5;

  const [count] = await db("incidents").where("ong_id", ongID).count();

  const incidents = await db("incidents")
    .join("ongs", "ongs.id", "=", "incidents.ong_id")
    .where("ong_id", ongID)
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

const update = async (req, h) => {
  const { ongID, incidentID } = req.params;
  const { credentials } = req.auth;

  if (ongID !== credentials.data.ongID) {
    return boom.forbidden("Você não poderá atualizar casos de outras ONGs");
  }

  const dados = req.payload;
  delete dados.id;
  delete dados.ong_id;

  const [existingIncident] = await db("incidents")
    .where("id", incidentID)
    .select("*");

  if (!existingIncident) {
    return boom.preconditionFailed(
      "Não foi possível encontrar um caso com o ID fornecido"
    );
  }
  if (existingIncident.ong_id !== ongID) {
    return boom.preconditionFailed("O incidente não pertence a esta ONG");
  }

  const newIncident = {
    ...existingIncident,
    ...dados,
  };

  await db("incidents")
    .where({ id: incidentID })
    .update({ ...newIncident });

  const result = await db("incidents").where("id", incidentID).select("*");
  return result;
};

const show = async (req, h) => {
  const { ongID, incidentID } = req.params;
  const { credentials } = req.auth;

  if (ongID !== credentials.data.ongID) {
    return boom.forbidden(
      "Você não poderá obter os dados cadastrais de um caso de outra ONG"
    );
  }

  const [existingIncident] = await db("incidents")
    .join("ongs", "ongs.id", "=", "incidents.ong_id")
    .where("incidents.id", incidentID)
    .select([
      "incidents.*",
      "ongs.name",
      "ongs.email",
      "ongs.whatsapp",
      "ongs.city",
      "ongs.uf",
    ]);

  if (!existingIncident) {
    return boom.preconditionFailed(
      "Não foi possível encontrar um caso com o ID fornecido"
    );
  }
  if (existingIncident.ong_id !== ongID) {
    return boom.preconditionFailed("O incidente não pertence a esta ONG");
  }

  return existingIncident;
};

const deleteOne = async (req, h) => {
  const { ongID, incidentID } = req.params;
  const { credentials } = req.auth;

  if (ongID !== credentials.data.ongID) {
    return boom.forbidden(
      "Você não poderá obter os dados cadastrais de um caso de outra ONG"
    );
  }

  const [existingIncident] = await db("incidents")
    .where("incidents.id", incidentID)
    .select("ong_id");

  if (!existingIncident) {
    return boom.preconditionFailed(
      "Não foi possível encontrar um caso com o ID fornecido"
    );
  }
  if (existingIncident.ong_id !== ongID) {
    return boom.preconditionFailed("O incidente não pertence a esta ONG");
  }

  await db("incidents").where({ id: incidentID }).update({ active: false });

  const result = await db("incidents")
    .join("ongs", "ongs.id", "=", "incidents.ong_id")
    .where("incidents.id", incidentID)
    .select([
      "incidents.*",
      "ongs.name",
      "ongs.email",
      "ongs.whatsapp",
      "ongs.city",
      "ongs.uf",
    ]);
  return {
    result,
    message: "Não é permitido deleter casos. O registro foi desativado",
  };
};

module.exports = {
  getAll,
  create,
  index,
  update,
  show,
  deleteOne,
};
