const Joi = require("@hapi/joi");

const headers = require("../../auth/strategies").getDefault().headersScheme;
const params = Joi.object({
  ongID: Joi.number().integer().required(),
});

const toGetAll = {
  query: Joi.object({
    page: Joi.number(),
  }),
};

const toCreate = {
  headers,
  params,
  payload: Joi.object({
    title: Joi.string().required().min(5),
    description: Joi.string().required().min(10),
    value: Joi.number().min(0),
  }),
};

module.exports = {
  toGetAll,
  toCreate,
};
