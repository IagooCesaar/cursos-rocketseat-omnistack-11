const Joi = require("@hapi/joi");

const headers = require("../../auth/strategies").getDefault().headersScheme;

const toLogin = {
  payload: Joi.object({
    email: Joi.string()
      .required()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "br"] },
      })
      .max(100),
    password: Joi.string().required(),
  }),
};

const toSecondFactorAuthentication = {
  payload: Joi.object({
    totp: Joi.string().required().length(6),
  }),
};

const toLogout = {
  headers,
};

module.exports = {
  toLogin,
  toSecondFactorAuthentication,
  toLogout,
};
