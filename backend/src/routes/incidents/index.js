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

  index() {
    return {
      method: "GET",
      path: basePath,
      handler: incidentHandler.index,
      options: {
        tags: ["api", "incidents"],
        description: "Lista de casos de uma ONG",
        notes: "Retornará uma lista de todos os casos cadastrados para uma ONG",
        validate: {
          failAction,
          ...incidentSchema.toIndex,
        },
      },
    };
  }

  show() {
    return {
      method: "GET",
      path: basePath + "/{incidentID}",
      handler: incidentHandler.show,
      options: {
        tags: ["api", "incidents"],
        description: "Dados de determinado caso",
        notes: "Retorna os dados cadatrais de determinado caso",
        validate: {
          failAction,
          ...incidentSchema.toShow,
        },
      },
    };
  }

  update() {
    return {
      method: "PATCH",
      path: basePath + "/{incidentID}",
      handler: incidentHandler.update,
      options: {
        tags: ["api", "incidents"],
        description: "Atualizar o cadastro de um caso",
        notes: "Atualizará o cadastro de um caso de uma determinada ONG",
        validate: {
          failAction,
          ...incidentSchema.toUpdate,
        },
      },
    };
  }
}

module.exports = IncidentsRoutes;
