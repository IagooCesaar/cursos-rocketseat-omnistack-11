const BaseRoute = require("../baseRoute");
const failAction = require("../failAction");

const ongHandler = require("./handlers");
const ongSchema = require("./schema");

const basePath = "/ongs";

class OngsRoutes extends BaseRoute {
  constructor() {
    super();
  }
  create() {
    return {
      method: "POST",
      path: basePath,
      handler: ongHandler.create,
      options: {
        auth: false,
        tags: ["api", "ongs"],
        description: "Cadastrar uma nova ONG",
        notes: "Cadastrará uma nova ONG quando respeitado os parâmetros",
        validate: {
          failAction,
          ...ongSchema.toCreate,
        },
      },
    };
  }

  update() {
    return {
      method: "PATCH",
      path: basePath + "/{id}",
      handler: ongHandler.update,
      options: {
        tags: ["api", "ongs"],
        description: "Atualizar o cadastro de uma nova ONG",
        notes:
          "Atualizará o cadastro de uma ONG quando respeitado os parâmetros",
        validate: {
          ...ongSchema.toUpdate,
        },
      },
    };
  }

  index() {
    return {
      method: "GET",
      path: basePath,
      handler: ongHandler.index,
      options: {
        auth: false,
        tags: ["api", "ongs"],
        description: "Lista de ONGs",
        notes: "Retornará uma lista de todas as ONGs cadastradas",
        validate: {
          failAction,
          ...ongSchema.toIndex,
        },
      },
    };
  }

  show() {
    return {
      method: "GET",
      path: basePath + "/{id}",
      handler: ongHandler.show,
      options: {
        tags: ["api", "ongs"],
        description: "Dados de determinada ONG",
        notes:
          "Retornará os dados cadastrais de uma ONG quando respeitado os parâmetros",
        validate: {
          failAction,
          ...ongSchema.toShow,
        },
      },
    };
  }

  // showByEmail() {
  //   return {
  //     method: "GET",
  //     path: basePath + "/{email}",
  //     handler: ongHandler.show,
  //     options: {
  //       tags: ["api", "ongs"],
  //       description: "Dados de determinada ONG",
  //       notes:
  //         "Retornará os dados cadastrais de uma ONG quando respeitado os parâmetros",
  //       validate: {
  //         failAction,
  //         ...ongSchema.toShowByEmail,
  //       },
  //     },
  //   };
  // }

  delete() {
    return {
      method: "DELETE",
      path: basePath + "/{id}",
      handler: ongHandler.deleteOne,
      options: {
        tags: ["api", "ongs"],
        description: "Desativar uma ONG",
        notes: "Desativará o cadastro de uma ONG",
        validate: {
          failAction,
          ...ongSchema.toDelete,
        },
      },
    };
  }
}

module.exports = OngsRoutes;
