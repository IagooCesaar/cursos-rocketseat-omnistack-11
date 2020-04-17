const { config } = require("dotenv");
const { join } = require("path");
const { ok } = require("assert");

const env = process.env.NODE_ENV || "dev";
ok(env === "prod" || env === "dev" || env === "test", " A env é inválida");

const envPath = join(__dirname, "..", "config", `.env.${env}`);
config({
  path: envPath,
});

const Hapi = require("hapi");

const app = Hapi.Server({
  port: process.env.PORT,
});

async function api() {
  app.route([
    {
      path: "/",
      method: "GET",
      handler: (req, h) => {
        return { message: "Olá" };
      },
    },
  ]);

  await app.start();
  console.log(
    `O servidor está em funcionamento. Acesse: http://localhost:${app.info.port}`
  );
}
module.exports = api();
