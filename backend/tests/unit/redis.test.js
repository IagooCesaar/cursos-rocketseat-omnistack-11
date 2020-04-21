const { config } = require("dotenv");
const { join } = require("path");
const assert = require("assert");
const Redis = require("../../src/database/redis");

const env = process.env.NODE_ENV || "dev";
const envPath = join(__dirname, "..", "..", "config", `.env.${env}`);
config({
  path: envPath,
});

describe("Suíte de testes Redis", function () {
  this.timeout(Infinity);

  // Redis.monitor();
  let connRedis = {};

  it("Deverá conectar ao Redis", async () => {
    Redis.connect();
    connRedis = Redis.get();
    // console.log(connRedis);
    assert.notEqual(connRedis, undefined);
  });

  it("Deverá registrar uma nova chave", async () => {
    const result = await connRedis.set("test", "valor");
    assert.deepEqual(result, "OK");
  });

  it("Deverá encontrar uma chave", async () => {
    const exists = await connRedis.exists("test");
    assert.deepEqual(exists, true);
  });

  it("Deverá obter o valor de uma chave", async () => {
    const result = await connRedis.get("test");
    assert.deepEqual(result, "valor");
  });

  it("Deverá remover uma chave", async () => {
    const result = await connRedis.del("test");
    assert.deepEqual(result, true);
  });

  it("NÃO deverá encontrar uma chave", async () => {
    const exists = await connRedis.exists("test");
    assert.deepEqual(exists, false);
  });
});
