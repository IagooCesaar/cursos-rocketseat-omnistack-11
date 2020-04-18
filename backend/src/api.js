const { config } = require("dotenv");
const { join } = require("path");
const { ok } = require("assert");

const env = process.env.NODE_ENV || "dev";
ok(env === "prod" || env === "dev" || env === "test", " A env é inválida");

const envPath = join(__dirname, "..", "config", `.env.${env}`);
config({
  path: envPath,
});

const Hapi = require("@hapi/hapi");

const Routes = require("./routes");

const app = Hapi.Server({
  host: process.env.HOST,
  port: process.env.PORT,
});

const db = require("./database/knex");
async function makeDB() {
  await db.migrate.latest();
}
makeDB();

async function api() {
  console.log("=> Importando rotas");
  app.route(Routes);
  console.log("=> Iniciando o servidor");
  await app.start();
  console.log(
    `O servidor está em funcionamento. Acesse: http://localhost:${app.info.port}`
  );
  return app;
}
process.on("unhandledRejection", (err) => {
  console.error("Erro não tratado => ", err);
});

module.exports = api();
