const BaseRoute = require("../baseRoute");
const failAction = require("../failAction");

const sessionHandler = require("./handlers");
const sessionSchema = require("./schema");

class SessionRoutes extends BaseRoute {
  constructor() {
    super();
  }
  login() {
    return {
      method: "POST",
      path: "/login",
      handler: sessionHandler.login,
      options: {
        auth: false,
        tags: ["api", "session"],
        description: "Iniciar uma nova sessão",
        notes: "Cadastrará uma nova ONG quando respeitado os parâmetros",
        validate: {
          failAction,
          ...sessionSchema.toLogin,
        },
      },
    };
  }

  SecondFactorAuth() {
    return {
      method: "POST",
      path: "/login/2fa",
      handler: sessionHandler.secondFactorAuthentication,
      options: {
        auth: "2fa",
        tags: ["api", "session"],
        description: "Validação do Segundo fator de autenticação",
        notes: "Cadastrará uma nova ONG quando respeitado os parâmetros",
        validate: {
          failAction,
          ...sessionSchema.toSecondFactorAuthenticationCreate,
        },
      },
    };
  }
}

module.exports = SessionRoutes;
