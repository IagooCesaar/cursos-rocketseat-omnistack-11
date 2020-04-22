const { readFile, writeFile } = require("fs");
const { promisify } = require("util");
const { join } = require("path");

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

class Database {
  constructor(target) {
    this.target = target.toLowerCase();
    this.NOME_ARQUIVO = join(
      __dirname,
      "data",
      `db.${target.toLowerCase()}.json`
    );
  }
  async getFromFile() {
    const arquivo = await readFileAsync(this.NOME_ARQUIVO, "utf8");
    return JSON.parse(arquivo.toString());
  }

  async setFile(dados) {
    await writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(dados), "utf8");
  }

  async getProp(nome) {
    const arquivo = await this.getFromFile();
    return arquivo[nome];
  }

  async setProp(nome, dados) {
    const arquivo = await this.getFromFile();
    // console.log("Arquivo antes", arquivo);
    arquivo[nome] = dados;
    // console.log("Arquivo depis", arquivo);
    this.setFile(arquivo);
  }
}

module.exports = Database;
