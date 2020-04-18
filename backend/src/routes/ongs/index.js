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
    };
  }

  show() {
    return {
      method: "GET",
      path: basePath + "/{id}",
      handler: ongHandler.show,
      options: {
        validate: {
          failAction,
          ...ongSchema.toShow,
        },
      },
    };
  }
}

module.exports = OngsRoutes;
