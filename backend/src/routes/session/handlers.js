const boom = require("boom");

const db = require("../../database/knex");
const repoOngs = require("../../repositories/ongs.repository");

const hash = require("../../utils/hash");
const Token = require("../../auth/token.auth");
const { LOGIN_EXPIRATION_MINUTES } = require("../../auth/config");

const {
  ERR_ONGS_NOT_FOUND,
  ERR_ONGS_INVALID_PASSWORD,
  ERR_GENERATE_TOKEN,
} = require("../../utils/errorTypes");

const canLog = process.env.CAN_LOG || false === true;

const login = async (req, h) => {
  try {
    const { email, password } = req.payload;
    const [ong] = await repoOngs.findByEmail(email);
    if (!ong) {
      throw new Error(ERR_ONGS_NOT_FOUND);
    }
    const compare = await hash.compare(password, ong.password);
    if (!compare) {
      throw new Error(ERR_ONGS_INVALID_PASSWORD);
    }

    const jwtData = {
      sub: ong.id, //subject: sujeito
      exp: Math.floor(Date.now() / 1000) + 60 * LOGIN_EXPIRATION_MINUTES,
    };
    const token = await Token.generate(jwtData);

    return h.response({ token }).code(201);
  } catch (error) {
    switch (error.message) {
      case ERR_ONGS_NOT_FOUND:
        throw boom.badData(
          "Não foi possível encontrar uma ONG com o e-mail fornecido"
        );
      case ERR_ONGS_INVALID_PASSWORD:
        throw boom.badData("A senha ou e-mail fornecidos são inválidos");
      case ERR_GENERATE_TOKEN:
        throw boom.unauthorized("Erro ao gerar o token");
      default:
        throw boom.badImplementation(error);
    }
  }
};

const secondFactorAuthentication = (req, h) => {
  return { message: "ok" };
};

module.exports = {
  login,
  secondFactorAuthentication,
};
