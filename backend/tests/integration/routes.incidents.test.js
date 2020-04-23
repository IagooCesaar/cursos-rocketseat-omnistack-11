const assert = require("assert");
const boom = require("@hapi/boom");
const api = require("../../src/api");

const Database = require("../mock/database");
const OngsDB = new Database("ongs");

let app = {};

const { MOCK_ONG_1, MOCK_ONG_2 } = require("../mock/ongs");

let validToken = "";
let validOng = {};
let invalidOng = {};
let headers = {};

describe.only("## Suíte de testes da rota de Casos", function () {
  this.beforeAll(async () => {
    let ongToCreate = {
      ...MOCK_ONG_2(Date.now()),
    };
    app = await api;
    const result1 = await app.inject({
      method: "POST",
      url: "/ongs",
      payload: ongToCreate,
    });
    const [dados1] = JSON.parse(result1.payload);
    validOng = { ...dados1, uncryptedPassword: ongToCreate.password };

    const result2 = await app.inject({
      method: "POST",
      url: "/login",
      payload: {
        email: ongToCreate.email,
        password: ongToCreate.password,
      },
    });
    const dados2 = JSON.parse(result2.payload);
    validToken = dados2.token;
    headers = {
      authorization: validToken,
    };

    ongToCreate = {
      ...MOCK_ONG_2(Date.now()),
    };
    app = await api;
    const result3 = await app.inject({
      method: "POST",
      url: "/ongs",
      payload: ongToCreate,
    });
    const [dados3] = JSON.parse(result3.payload);
    invalidOng = { ...dados3, uncryptedPassword: ongToCreate.password };
  });

  it("Deverá cadastrar um caso para uma ONG", async () => {
    const incident = {
      title: `Caso ${Date.now()}`,
      description: `Detalhes do caso ${Date.now()}`,
      value: 100,
    };

    const result = await app.inject({
      method: "POST",
      url: `/ongs/${validOng.id}/incidents`,
      headers,
      payload: incident,
    });

    assert.deepEqual(result.statusCode, 201);
  });

  it("NÃO deverá cadastrar um caso para uma ONG diferente da autenticada", async () => {
    const incident = {
      title: `Caso ${Date.now()}`,
      description: `Detalhes do caso ${Date.now()}`,
      value: 100,
    };
    const expected = {
      statusCode: 403,
      error: "Forbidden",
      message: "Você não poderá criar casos para outras ONGs",
    };

    const result = await app.inject({
      method: "POST",
      url: `/ongs/${invalidOng.id}/incidents`,
      headers,
      payload: incident,
    });
    const dados = JSON.parse(result.payload);

    assert.deepEqual(dados, expected);
  });

  it("Deverá obter duas listas de casos cadastrados e concatenar em apenas uma", async () => {
    const [result1, result2] = await Promise.all([
      app.inject({
        method: "GET",
        url: "/incidents?page=1",
      }),
      app.inject({
        method: "GET",
        url: "/incidents?page=2",
      }),
    ]);
    const total = result1.headers["x-total-count"];
    const itensPerPage = result1.headers["x-itens-per-page"];
    const dados1 = JSON.parse(result1.payload);
    const dados2 = JSON.parse(result2.payload);
    const dados = dados1.concat(dados2);

    assert.ok(dados.length <= 2 * itensPerPage);
  });
});
