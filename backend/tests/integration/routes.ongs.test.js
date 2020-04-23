const assert = require("assert");
const boom = require("@hapi/boom");
const api = require("../../src/api");

const Database = require("../mock/database");
const OngsDB = new Database("ongs");

let app = {};

const { MOCK_ONG_1, MOCK_ONG_2 } = require("../mock/ongs");

function JsonObj(jsonAsString) {
  return JSON.parse(jsonAsString);
}

let validToken = "";
let validOng = "";
let headers = {};

describe.only("## Suíte de testes da rota de ONGS", function () {
  this.timeout(Infinity);

  this.beforeAll(async () => {
    const ongToCreate = {
      ...MOCK_ONG_2(Date.now()),
    };

    app = await api;
    const result1 = await app.inject({
      method: "POST",
      url: "/ongs",
      payload: ongToCreate,
    });

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
  });

  it("Deverá cadastrar uma ONG", async () => {
    let ongToCreate = {
      ...MOCK_ONG_2(Date.now()),
    };

    const result = await app.inject({
      method: "POST",
      url: "/ongs",
      payload: ongToCreate,
    });
    let [dados] = JSON.parse(result.payload);

    delete ongToCreate.password;
    delete dados.id;
    delete dados.active;

    assert.deepEqual(result.statusCode, 201);
    assert.deepEqual(dados, ongToCreate);
  });

  it("NÃO deverá cadastrar uma ONG de mesmo e-mail", async () => {
    let ongToCreate = {
      ...MOCK_ONG_1,
    };
    const expectedError = {
      statusCode: 422,
      error: "Unprocessable Entity",
      message: "Já existe uma ONG cadastrada com este e-mail",
    };

    const result = await app.inject({
      method: "POST",
      url: "/ongs",
      payload: ongToCreate,
    });
    const dados = JsonObj(result.payload);

    assert.deepEqual(dados, expectedError);
  });

  it("NÃO deverá cadastrar um ONG por erro no payload - nome obrigatório", async () => {
    let wrongOng = {
      ...MOCK_ONG_1,
    };
    delete wrongOng.name;

    const expectedError = {
      statusCode: 400,
      error: "Bad Request",
      message: '"name" is required',
      validation: { source: "payload", keys: ["name"] },
    };

    const result = await app.inject({
      method: "POST",
      url: "/ongs",
      payload: wrongOng,
    });
    const dados = JsonObj(result.payload);
    assert.ok(
      result.statusCode === 400,
      "O status code não confere com 400 => " + result.statusCode
    );
    assert.deepEqual(
      dados,
      expectedError,
      "O retorno não confere com o esperado"
    );
  });

  it("NÃO deverá cadastrar um ONG por erro no payload - e-mail inválido", async () => {
    let wrongOng = {
      ...MOCK_ONG_1,
      email: "error",
    };

    const expectedError = {
      statusCode: 400,
      error: "Bad Request",
      message: '"email" must be a valid email',
      validation: { source: "payload", keys: ["email"] },
    };

    const result = await app.inject({
      method: "POST",
      url: "/ongs",
      payload: wrongOng,
    });
    const dados = JsonObj(result.payload);

    assert.ok(
      result.statusCode === 400,
      "O status code não confere com 400 => " + result.statusCode
    );
    assert.deepEqual(
      dados,
      expectedError,
      "O retorno não confere com o esperado"
    );
  });

  it("Deverá listar ONGS cadastradas", async () => {
    const result = await app.inject({
      method: "GET",
      url: "/ongs",
      headers,
    });
    const dados = JSON.parse(result.payload);
    assert.ok(Array.isArray(dados));
  });

  it("Deverá retornar ONG cadastrada com o ID = 1", async () => {
    const ongID = 1;
    const result = await app.inject({
      method: "GET",
      url: `/ongs/${ongID}`,
      headers,
    });
    const [dados] = JSON.parse(result.payload);
    delete dados.password;
    assert.ok(result.statusCode === 200, "Não houve êxito no retorno");
    assert.ok(
      dados.id === ongID,
      `O ID retornado pela API não confere com o parâmetro ${ongID}`
    );
  });

  it("NÃO deverá retornar ONG cadastrada pois filtro ID inválido", async () => {
    const ongID = "aaa";
    const expectedError = {
      statusCode: 400,
      error: "Bad Request",
      message: '"id" must be a number',
      validation: { source: "params", keys: ["id"] },
    };

    const result = await app.inject({
      method: "GET",
      url: `/ongs/${ongID}`,
      headers,
    });
    const dados = JSON.parse(result.payload);

    assert.ok(
      result.statusCode === 400,
      "O status code não confere com 400 => " + result.statusCode
    );
    assert.deepEqual(
      dados,
      expectedError,
      "O retorno não confere com o esperado"
    );
  });

  it("Deverá atualizar o cadastro de uma ONG", async () => {
    let ongToUpdate = {
      name: "ONG TESTE UPD",
    };
    const ongID = 1;

    const result = await app.inject({
      method: "PATCH",
      url: `/ongs/${ongID}`,
      payload: ongToUpdate,
      headers,
    });
    let [dados] = JSON.parse(result.payload);

    assert.ok(
      result.statusCode === 200,
      `Retorno diferente de 200: ${result.statusCode}`
    );
    assert.deepEqual(dados.name, ongToUpdate.name);
  });

  it("NÃO deverá atualizar o cadastro de uma ONG com ID inválido", async () => {
    let ongToUpdate = {
      name: "ONG TESTE UPD",
    };
    const ongID = "AAAA";

    const expectedError = {
      statusCode: 400,
      error: "Bad Request",
      message: "Invalid request params input",
    };

    const result = await app.inject({
      method: "PATCH",
      url: `/ongs/${ongID}`,
      payload: ongToUpdate,
      headers,
    });
    let dados = JSON.parse(result.payload);

    assert.deepEqual(dados, expectedError);
  });

  it("NÃO deverá atualizar o cadastro de uma ONG com ID inexistente", async () => {
    let ongToUpdate = {
      name: "ONG TESTE UPD",
    };
    const ongID = -1;

    const expectedError = {
      error: "Precondition Failed",
      message: "Não foi possível encontrar uma ONG com o ID fornecido ",
      statusCode: 412,
    };

    const result = await app.inject({
      method: "PATCH",
      url: `/ongs/${ongID}`,
      payload: ongToUpdate,
      headers,
    });
    let dados = JSON.parse(result.payload);

    assert.deepEqual(dados, expectedError);
  });

  it("NÃO deverá atualizar o cadastro de uma ONG pois e-mail está uso por outra entidade", async () => {
    let ongToCreate = {
      ...MOCK_ONG_2(Date.now()),
    };
    const result1 = await app.inject({
      method: "POST",
      url: "/ongs",
      payload: ongToCreate,
      headers,
    });
    let [dados1] = JSON.parse(result1.payload);
    delete dados1.id;
    delete dados1.active;
    delete ongToCreate.password;

    assert.ok((result1.statusCode = 200), "Não houve êxito no retorno");
    assert.deepEqual(dados1, ongToCreate);

    let ongToUpdate = {
      name: "ONG TESTE 2 - UPD",
      email: MOCK_ONG_1.email,
    };
    const ongID = 2;

    const expectedError = {
      statusCode: 400,
      error: "Bad Request",
      message:
        "Não será possível alterar o e-mail da ONG pois o mesmo está em uso por outra entidade",
    };
    const result2 = await app.inject({
      method: "PATCH",
      url: `/ongs/${ongID}`,
      payload: ongToUpdate,
      headers,
    });
    const dados2 = JSON.parse(result2.payload);

    assert.deepEqual(dados2, expectedError);
  });

  it("Deverá deletar/desativar o cadastro de uma ONG", async () => {
    let ongToCreate = {
      ...MOCK_ONG_2(Date.now()),
    };

    const result1 = await app.inject({
      method: "POST",
      url: "/ongs",
      payload: ongToCreate,
      headers,
    });
    let [dados1] = JSON.parse(result1.payload);

    assert.deepEqual(result1.statusCode, 201);
    const idToDelete = dados1.id;

    const result2 = await app.inject({
      method: "DELETE",
      url: `/ongs/${idToDelete}`,
      headers,
    });

    const dados2 = JSON.parse(result2.payload);

    assert.deepEqual(result2.statusCode, 200);
    assert.deepEqual(dados2.result[0].active, false);
    assert.deepEqual(
      dados2.message,
      "Não é permitido deletar ONGs. O registro foi desativado"
    );
  });

  // this.afterAll(async () => {
  //   app.stop();
  // });
});
