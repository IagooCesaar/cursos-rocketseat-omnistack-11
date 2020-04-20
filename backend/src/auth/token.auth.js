const jwt = require("jsonwebtoken");
const { DEFAULT_EXPIRATION_MINUTE, ALGORITHM } = require("./config");

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

module.exports = {
  generate,
};
