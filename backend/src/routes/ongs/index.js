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
          payload: ongSchema.toCreate,
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
          params: ongSchema.toShow,
        },
      },
    };
  }
}

module.exports = OngsRoutes;
