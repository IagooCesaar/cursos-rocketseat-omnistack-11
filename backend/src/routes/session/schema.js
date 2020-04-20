const Joi = require("@hapi/joi");

const toLogin = {
  payload: Joi.object({
    email: Joi.string()
      .required()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
    password: Joi.string().required(),
  }),
};

const toSecondFactorAuthentication = {
  payload: Joi.object({
    totp: Joi.string().required().length(6),
  }),
};

module.exports = {
  toLogin,
  toSecondFactorAuthentication,
};
