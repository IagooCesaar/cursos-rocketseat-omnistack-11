const assert = require("assert");
const api = require("../../src/api");

let app = {};

const MOCK_ONG = {
  name: "ONG TESTE",
  email: "teste@teste.com",
  password: "abc123",
  whatsapp: "5535998155841",
  city: "São Gonçalo do Sapucaí",
  uf: "MG",
};

function JsonObj(jsonAsString) {
  return JSON.parse(jsonAsString);
}

describe("## Suíte de testes da rota de ONGS", function () {
  this.beforeAll(async () => {
    app = await api;
  });

  it("Deverá cadastrar um ONG", async () => {
    let ongToCreate = {
      ...MOCK_ONG,
    };

    const result = await app.inject({
      method: "POST",
      url: "/ongs",
      payload: ongToCreate,
    });

    let [dados] = JSON.parse(result.payload);
    delete ongToCreate.password;
    delete dados.password;
    delete dados.id;

    assert.ok((result.statusCode = 200), "Não houve êxito no retorno");
    assert.deepEqual(
      dados,
      ongToCreate,
      "O retorno do cadastro da ONG não está como esperado"
    );
  });

  it("NÃO deverá cadastrar um ONG por erro no payload - nome obrigatório", async () => {
    let wrongOng = {
      ...MOCK_ONG,
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
      ...MOCK_ONG,
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
    });
    const dados = JSON.parse(result.payload);
    assert.ok(Array.isArray(dados), "O valor retornado não é uma lista válida");
  });

  it("Deverá retornar ONG cadastrada com o ID = 1", async () => {
    const ongID = 1;
    const result = await app.inject({
      method: "GET",
      url: `/ongs/${ongID}`,
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

  this.afterAll(async () => {
    app.stop();
  });
});
