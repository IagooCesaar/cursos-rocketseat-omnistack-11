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

const Routes = require("./routes");

const app = Hapi.Server({
  host: process.env.HOST,
  port: process.env.PORT,
});

const db = require("./database/knex");
async function makeDB() {
  await db.migrate.latest();
}

async function api() {
  console.log("=> Atualizando metadados do BD");
  await makeDB();

  console.log("=> Registrando plugins");
  await app.register([Vision, Inert, hapiSwaggerPlugin]);

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
