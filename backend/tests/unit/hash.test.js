const assert = require("assert");
const hash = require("../../src/utils/hash");

const MOCK_PALAVRA = "GERAR_HASH";
let validHash = "";

describe("## Testes de geração e validação de Hash", function () {
  it("Deverá gerar um hash de uma string", async () => {
    validHash = await hash.make(MOCK_PALAVRA);
    assert.ok(
      validHash.length >= 10,
      "O hash NÃO possuí 10 ou mais caracteres"
    );
  });

  it("Deverá validar o hash gerado para a string", async () => {
    const result = await hash.compare(MOCK_PALAVRA, validHash);
    assert.ok(result, "O Hash não foi validado :(");
  });

  it("NÃO deverá validar o hash por utilizar outra string", async () => {
    const outraPalavra = "ERR_" + MOCK_PALAVRA;
    const result = await hash.compare(outraPalavra, validHash);
    assert.ok(!result, "O Hash foi validado :(");
  });
});
