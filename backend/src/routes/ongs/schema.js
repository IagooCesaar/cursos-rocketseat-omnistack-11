const Joi = require("@hapi/joi");

const headers = require("../../auth/strategies").getDefault().headersScheme;

const toCreate = {
  payload: Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .required()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
    password: Joi.string().required(),
    whatsapp: Joi.string()
      .required()
      .pattern(new RegExp("^(?:(55\\d{2})|\\d{2})[6-9]\\d{8}$")),
    city: Joi.string().required(),
    uf: Joi.string().required().length(2),
  }),
};

const toIndex = {
  headers,
};

const toUpdate = {
  headers,
  payload: Joi.object({
    name: Joi.string(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string(),
    whatsapp: Joi.string().pattern(
      new RegExp("^(?:(55\\d{2})|\\d{2})[6-9]\\d{8}$")
    ),
    city: Joi.string(),
    uf: Joi.string().length(2),
    active: Joi.boolean(),
  }),
  params: Joi.object({
    id: Joi.number().integer().required(),
  }),
};

const toShow = {
  headers,
  params: Joi.object({
    id: Joi.number().integer().required(),
  }),
};

const toDelete = {
  headers,
  params: Joi.object({
    id: Joi.number().integer().required(),
  }),
};

module.exports = {
  toCreate,
  toIndex,
  toShow,
  toUpdate,
  toDelete,
};
