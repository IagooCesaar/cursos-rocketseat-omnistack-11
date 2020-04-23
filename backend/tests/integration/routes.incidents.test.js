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

  it("Deverá obter uma lista de casos cadastrados para uma determinada ONG", async () => {
    const result = await app.inject({
      method: "GET",
      url: `/ongs/${validOng.id}/incidents`,
      headers,
    });
    const [dados] = JSON.parse(result.payload);

    assert.deepEqual(dados.ong_id, validOng.id);
  });

  it("NÃO deverá obter uma lista de casos cadastrados para uma ONG diferente da autenticada", async () => {
    const expected = {
      statusCode: 403,
      error: "Forbidden",
      message: "Você não poderá listar casos de outras ONGs",
    };

    const result = await app.inject({
      method: "GET",
      url: `/ongs/${invalidOng.id}/incidents`,
      headers,
    });
    const dados = JSON.parse(result.payload);

    assert.deepEqual(dados, expected);
  });

  it("Deverá obter os dados cadastrais de um determinado caso", async () => {
    const toCreate = {
      title: `Caso ${Date.now()}`,
      description: `Detalhes do caso ${Date.now()}`,
      value: 100,
    };

    const result1 = await app.inject({
      method: "POST",
      url: `/ongs/${validOng.id}/incidents`,
      headers,
      payload: toCreate,
    });
    assert.deepEqual(result1.statusCode, 201);
    const { incidentID } = JSON.parse(result1.payload);

    const result2 = await app.inject({
      method: "GET",
      url: `/ongs/${validOng.id}/incidents/${incidentID}`,
      headers,
    });
    const incident = JSON.parse(result2.payload);
    delete incident.id;
    delete incident.ong_id;
    delete incident.active;
    delete incident.name;
    delete incident.email;
    delete incident.whatsapp;
    delete incident.city;
    delete incident.uf;

    assert.deepEqual(incident, toCreate);
  });

  it("NÃO deverá obter os dados cadastrais de um caso inexistente", async () => {
    const expected = {
      statusCode: 412,
      error: "Precondition Failed",
      message: "Não foi possível encontrar um caso com o ID fornecido",
    };
    const result2 = await app.inject({
      method: "GET",
      url: `/ongs/${validOng.id}/incidents/${9999}`,
      headers,
    });
    const dados = JSON.parse(result2.payload);

    assert.deepEqual(dados, expected);
  });

  it("NÃO deverá obter os dados cadastrais de um caso de uma ONG diferente da autenticada", async () => {
    const toCreate = {
      title: `Caso ${Date.now()}`,
      description: `Detalhes do caso ${Date.now()}`,
      value: 100,
    };

    const result1 = await app.inject({
      method: "POST",
      url: `/ongs/${validOng.id}/incidents`,
      headers,
      payload: toCreate,
    });
    assert.deepEqual(result1.statusCode, 201);
    const { incidentID } = JSON.parse(result1.payload);

    const expected = {
      statusCode: 403,
      error: "Forbidden",
      message:
        "Você não poderá obter os dados cadastrais de um caso de outra ONG",
    };
    const result2 = await app.inject({
      method: "GET",
      url: `/ongs/${invalidOng.id}/incidents/${incidentID}`,
      headers,
    });
    const dados = JSON.parse(result2.payload);

    assert.deepEqual(dados, expected);
  });

  it("Deverá atualizar o cadastro de um caso de uma determinada ONG", async () => {
    const toCreate = {
      title: `Caso ${Date.now()}`,
      description: `Detalhes do caso ${Date.now()}`,
      value: 100,
    };

    const result1 = await app.inject({
      method: "POST",
      url: `/ongs/${validOng.id}/incidents`,
      headers,
      payload: toCreate,
    });
    assert.deepEqual(result1.statusCode, 201);
    const { incidentID } = JSON.parse(result1.payload);

    const result2 = await app.inject({
      method: "GET",
      url: `/ongs/${validOng.id}/incidents/${incidentID}`,
      headers,
    });
    const incident = JSON.parse(result2.payload);

    const toUpdate = {
      active: false,
      title: "Caso atualizado",
    };
    const result3 = await app.inject({
      method: "PATCH",
      url: `/ongs/${validOng.id}/incidents/${incident.id}`,
      payload: toUpdate,
      headers,
    });
    assert.deepEqual(result3.statusCode, 200);

    const [dados] = JSON.parse(result3.payload);

    delete incident.name;
    delete incident.email;
    delete incident.whatsapp;
    delete incident.city;
    delete incident.uf;

    assert.deepEqual(dados, { ...incident, ...toUpdate });
  });

  it("NÃO deverá atualizar o cadastro de um caso de uma outra ONG", async () => {
    const toCreate = {
      title: `Caso ${Date.now()}`,
      description: `Detalhes do caso ${Date.now()}`,
      value: 100,
    };

    const result1 = await app.inject({
      method: "POST",
      url: `/ongs/${validOng.id}/incidents`,
      headers,
      payload: toCreate,
    });
    assert.deepEqual(result1.statusCode, 201);
    const { incidentID } = JSON.parse(result1.payload);

    const result2 = await app.inject({
      method: "GET",
      url: `/ongs/${validOng.id}/incidents/${incidentID}`,
      headers,
    });
    const incident = JSON.parse(result2.payload);

    const toUpdate = {
      active: false,
      title: "Caso atualizado",
    };
    const expected = {
      statusCode: 403,
      error: "Forbidden",
      message: "Você não poderá atualizar casos de outras ONGs",
    };
    const result3 = await app.inject({
      method: "PATCH",
      url: `/ongs/${invalidOng.id}/incidents/${incident.id}`,
      payload: toUpdate,
      headers,
    });
    const dados = JSON.parse(result3.payload);
    assert.deepEqual(dados, expected);
  });

  it("NÃO deverá atualizar o cadastro de um caso inexistente", async () => {
    const toUpdate = {
      active: false,
      title: "Caso atualizado",
    };
    const expected = {
      statusCode: 412,
      error: "Precondition Failed",
      message: "Não foi possível encontrar um caso com o ID fornecido",
    };
    const result = await app.inject({
      method: "PATCH",
      url: `/ongs/${validOng.id}/incidents/${9999}`,
      payload: toUpdate,
      headers,
    });
    const dados = JSON.parse(result.payload);
    assert.deepEqual(dados, expected);
  });

  it("Deverá deletar/desativar o cadastro de um caso de uma determinada ONG", async () => {
    const toCreate = {
      title: `Caso ${Date.now()}`,
      description: `Detalhes do caso ${Date.now()}`,
      value: 100,
    };

    const result1 = await app.inject({
      method: "POST",
      url: `/ongs/${validOng.id}/incidents`,
      headers,
      payload: toCreate,
    });
    assert.deepEqual(result1.statusCode, 201);
    const { incidentID } = JSON.parse(result1.payload);

    const result2 = await app.inject({
      method: "DELETE",
      url: `/ongs/${validOng.id}/incidents/${incidentID}`,
      headers,
    });
    const { message } = JSON.parse(result2.payload);
    assert.deepEqual(
      message,
      "Não é permitido deleter casos. O registro foi desativado"
    );
  });

  it("NÃO deverá deletar/desativar o cadastro de um caso de uma ONG diferente da autenticada", async () => {
    const toCreate = {
      title: `Caso ${Date.now()}`,
      description: `Detalhes do caso ${Date.now()}`,
      value: 100,
    };

    const result1 = await app.inject({
      method: "POST",
      url: `/ongs/${validOng.id}/incidents`,
      headers,
      payload: toCreate,
    });
    assert.deepEqual(result1.statusCode, 201);
    const { incidentID } = JSON.parse(result1.payload);

    const expected = {
      error: "Forbidden",
      message:
        "Você não poderá obter os dados cadastrais de um caso de outra ONG",
      statusCode: 403,
    };
    const result2 = await app.inject({
      method: "DELETE",
      url: `/ongs/${invalidOng.id}/incidents/${incidentID}`,
      headers,
    });
    const dados = JSON.parse(result2.payload);
    assert.deepEqual(dados, expected);
  });

  it("NÃO deverá deletar/desativar o cadastro de um caso inexistente", async () => {
    const toCreate = {
      title: `Caso ${Date.now()}`,
      description: `Detalhes do caso ${Date.now()}`,
      value: 100,
    };

    const result1 = await app.inject({
      method: "POST",
      url: `/ongs/${validOng.id}/incidents`,
      headers,
      payload: toCreate,
    });
    assert.deepEqual(result1.statusCode, 201);
    const { incidentID } = JSON.parse(result1.payload);

    const expected = {
      error: "Precondition Failed",
      message: "Não foi possível encontrar um caso com o ID fornecido",
      statusCode: 412,
    };
    const result2 = await app.inject({
      method: "DELETE",
      url: `/ongs/${validOng.id}/incidents/${9999}`,
      headers,
    });
    const dados = JSON.parse(result2.payload);
    assert.deepEqual(dados, expected);
  });
});
