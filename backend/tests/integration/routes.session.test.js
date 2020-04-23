const assert = require("assert");
const api = require("../../src/api");
const { MOCK_ONG_2 } = require("../mock/ongs");

const { decode } = require("../../src/auth/token.auth");

let app = {};
let ong = {};
let token = "";

describe("## Suíte de testes da rota de sessão", function () {
  this.beforeAll(async () => {
    app = await api;
  });

  it("Deverá cadastrar uma ONG para realizar os testes", async () => {
    const ongToCreate = {
      ...MOCK_ONG_2(Date.now()),
    };

    const result = await app.inject({
      method: "POST",
      url: "/ongs",
      payload: ongToCreate,
    });

    let [dados] = JSON.parse(result.payload);
    ong = dados;
    ong.uncryptPassword = ongToCreate.password;

    assert.deepEqual(result.statusCode, 201);
  });

  it("Deverá realizar login", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: {
        email: ong.email,
        password: ong.uncryptPassword,
      },
    });
    assert.deepEqual(result.statusCode, 201);

    const dados = JSON.parse(result.payload);
    token = dados.token;
    decodedToken = await decode(token);
    assert.deepEqual(ong.id, decodedToken.payload.data.ongID);
  });

  it("Deverá realizar o logout", async () => {
    const expected = {
      message: `Logout realizado para Ong ID ${ong.id}`,
    };
    const result = await app.inject({
      method: "POST",
      url: "/logout",
      headers: {
        authorization: token,
      },
    });
    assert.deepEqual(result.statusCode, 201);

    const dados = JSON.parse(result.payload);
    assert.deepEqual(dados, expected);
  });

  it("NÃO deverá consegui realizar logout", async () => {
    const expected = {
      statusCode: 401,
      error: "Unauthorized",
      message: "Invalid credentials",
      attributes: { error: "Invalid credentials" },
    };

    const result = await app.inject({
      method: "POST",
      url: "/logout",
      headers: {
        authorization: token,
      },
    });
    const dados = JSON.parse(result.payload);
    assert.deepEqual(dados, expected);
  });

  it("NÃO Deverá conseguir realizar login por erro de email", async () => {
    const ongToCreate = {
      ...MOCK_ONG_2(Date.now()),
    };

    const result1 = await app.inject({
      method: "POST",
      url: "/ongs",
      payload: ongToCreate,
    });
    assert.deepEqual(result1.statusCode, 201);

    const expected = {
      statusCode: 422,
      error: "Unprocessable Entity",
      message: "Não foi possível encontrar uma ONG com o e-mail fornecido",
    };
    const result2 = await app.inject({
      method: "POST",
      url: "/login",
      payload: {
        email: "erro@email.com",
        password: ongToCreate.password,
      },
    });
    const dados = JSON.parse(result2.payload);
    assert.deepEqual(dados, expected);
  });

  it("NÃO Deverá conseguir realizar login por erro de senha", async () => {
    const ongToCreate = {
      ...MOCK_ONG_2(Date.now()),
    };

    const result1 = await app.inject({
      method: "POST",
      url: "/ongs",
      payload: ongToCreate,
    });
    assert.deepEqual(result1.statusCode, 201);

    const expected = {
      statusCode: 422,
      error: "Unprocessable Entity",
      message: "A senha ou e-mail fornecidos são inválidos",
    };
    const result2 = await app.inject({
      method: "POST",
      url: "/login",
      payload: {
        email: ongToCreate.email,
        password: ongToCreate.password + "ERROR",
      },
    });
    const dados = JSON.parse(result2.payload);
    assert.deepEqual(dados, expected);
  });
});
