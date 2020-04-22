const jwt = require("jsonwebtoken");
const {
  DEFAULT_EXPIRATION_MINUTE,
  ALGORITHM,
  BLACKLIST_TOKEN_CACHE_PREFIX,
} = require("./config");
const Cache = require("../repositories/cache.repository");

const generate = (payload) => {
  return new Promise((resolve, reject) => {
    payload.iss = "api-BeTheHero";

    payload.exp
      ? (payload.exp = payload.exp)
      : Math.floor(Date.now() / 1000) + 60 * DEFAULT_EXPIRATION_MINUTE;

    jwt.sign(
      payload,
      process.env.JWT_KEY,
      {
        algorithm: ALGORITHM,
      },
      function (err, newToken) {
        if (err) {
          throw new Error(ERR_GENERATE_TOKEN);
        }
        resolve(newToken);
      }
    );
  });
};

const decode = (token) => {
  return new Promise((resolve, reject) => {
    const options = {
      complete: true,
    };
    const dados = jwt.decode(token, options);
    resolve(dados);
  });
};

const invalidate = (token, expiration = DEFAULT_EXPIRATION_MINUTE) =>
  Cache.set(`${BLACKLIST_TOKEN_CACHE_PREFIX}${token}`, 1, expiration);

const hasInvalidated = (token) =>
  Cache.exists(`${BLACKLIST_TOKEN_CACHE_PREFIX}${token}`);

module.exports = {
  generate,
  decode,
  invalidate,
  hasInvalidated,
};
