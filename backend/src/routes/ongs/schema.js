const Joi = require("@hapi/joi");

const headers = require("../../auth/strategies").getDefault().headersScheme;

const toCreate = {
  payload: Joi.object({
    name: Joi.string().required().max(100),
    email: Joi.string()
      .required()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "br"] },
      })
      .max(100),
    password: Joi.string().required().max(20),
    whatsapp: Joi.string()
      .required()
      .pattern(new RegExp("^(?:(55\\d{2})|\\d{2})[6-9]\\d{8}$")),
    city: Joi.string().required().max(60),
    uf: Joi.string().required().length(2),
  }),
};

const toIndex = {
  headers,
  query: Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "br"] },
      })
      .max(100),
  }),
};

const toUpdate = {
  headers,
  payload: Joi.object({
    name: Joi.string().max(100),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "br"] },
      })
      .max(100),
    password: Joi.string().max(20),
    whatsapp: Joi.string().pattern(
      new RegExp("^(?:(55\\d{2})|\\d{2})[6-9]\\d{8}$")
    ),
    city: Joi.string().max(60),
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

const toShowByEmail = {
  headers,
  params: Joi.object({
    email: Joi.string()
      .required()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "br"] },
      })
      .max(100),
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
  // toShowByEmail,
  toUpdate,
  toDelete,
};
