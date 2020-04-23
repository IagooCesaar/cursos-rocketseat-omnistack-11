const BaseRoute = require("../baseRoute");
const failAction = require("../failAction");

const incidentHandler = require("./handlers");
const incidentSchema = require("./schema");

const basePath = "/ongs/{ongID}/incidents";

class IncidentsRoutes extends BaseRoute {
  constructor() {
    super();
  }

  getAll() {
    return {
      method: "GET",
      path: "/incidents",
      handler: incidentHandler.getAll,
      options: {
        auth: false,
        tags: ["api", "incidents"],
        description: "Lista de casos",
        notes: "Retornará uma lista de todos os casos cadastrados",
        validate: {
          failAction,
          ...incidentSchema.toGetAll,
        },
      },
    };
  }

  create() {
    return {
      method: "POST",
      path: basePath,
      handler: incidentHandler.create,
      options: {
        tags: ["api", "incidents"],
        description: "Cadastrar um novo caso",
        notes: "Cadastrará uma novo caso para a ONG",
        validate: {
          failAction,
          ...incidentSchema.toCreate,
        },
      },
    };
  }
}

module.exports = IncidentsRoutes;
