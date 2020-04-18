const Joi = require("@hapi/joi");

const toCreate = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string().required(),
  whatsapp: Joi.string().pattern(
    new RegExp("^(?:(55\\d{2})|\\d{2})[6-9]\\d{8}$")
  ),
  city: Joi.string().required(),
  uf: Joi.string().required().length(2),
});

const toShow = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = {
  toCreate,
  toShow,
};
