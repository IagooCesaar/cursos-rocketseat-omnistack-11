const BaseRoute = require("./baseRoute");
const failAction = require("./failAction");

class UtilRoutes extends BaseRoute {
  constructor() {
    super();
  }

  home() {
    return {
      method: "*",
      path: "/",
      handler: function (req, h) {
        return h.redirect("/documentation");
      },
    };
  }
}

module.exports = UtilRoutes;
