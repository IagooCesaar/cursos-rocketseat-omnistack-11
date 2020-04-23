const { config } = require("dotenv");
const { join } = require("path");
const { ok } = require("assert");

const env = process.env.NODE_ENV || "dev";
ok(env === "prod" || env === "dev" || env === "test", " A env é inválida");

const envPath = join(__dirname, "..", "config", `.env.${env}`);
config({
  path: envPath,
});

const pkg = require("../package.json");

const Hapi = require("@hapi/hapi");
const Vision = require("@hapi/vision");
const Inert = require("@hapi/inert");
const HapiSwagger = require("hapi-swagger");
const HapiJwt = require("hapi-auth-jwt2");

const Routes = require("./routes");
const { strategies } = require("./auth/strategies");

const db = require("./database/knex");
const Cache = require("./database/redis");

const hapiSwaggerPlugin = {
  plugin: HapiSwagger,
  options: {
    info: {
      title: "API #BeTheHero - 11ª Semana OmniStack Rocketseat",
      version: `v${pkg.version}`,
      contact: {
        name: "Iago César F. Nogueira",
        email: "iagocesar.nogueira@gmail.com",
      },
    },
    grouping: "tags",
    // lang: "pt-BR",
  },
};

const app = Hapi.Server({
  host: process.env.HOST,
  port: process.env.PORT,
});

async function makeDB() {
  await db.migrate.latest();
}

async function initiateCache() {
  await Cache.connect();
}

async function api() {
  console.log("=> Ambiente de execução: " + env);

  console.log("=> Atualizando metadados do BD");
  await makeDB();

  console.log("=> Inicializando o Cache");
  await initiateCache();

  console.log("=> Registrando plugins");
  await app.register([HapiJwt, Vision, Inert, hapiSwaggerPlugin]);

  console.log(
    `=> Preparando ${strategies.length} estratégia(s) de autenticação da API`
  );
  let defaultStrategy = "";
  strategies.map((strategy) => {
    app.auth.strategy(strategy.name, strategy.scheme, strategy.options);
    if (strategy.default && defaultStrategy === "")
      defaultStrategy = strategy.name;
  });
  app.auth.default(defaultStrategy || "jwt");

  console.log("=> Importando rotas");
  app.route(Routes);

  console.log("=> Iniciando o servidor");
  await app.start();
  console.log(
    `=> O servidor está em funcionamento. Acesse: http://localhost:${app.info.port}`
  );

  return app;
}
process.on("unhandledRejection", (err) => {
  console.error("Erro não tratado => ", err);
});

module.exports = api();
