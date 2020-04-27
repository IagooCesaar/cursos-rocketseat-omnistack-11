const Joi = require("@hapi/joi");

const headers = require("../../auth/strategies").getDefault().headersScheme;
const param = Joi.object({
  ongID: Joi.number().integer().required(),
});
const params = Joi.object({
  ongID: Joi.number().integer().required(),
  incidentID: Joi.number().integer().required(),
});

const toGetAll = {
  query: Joi.object({
    page: Joi.number(),
  }),
};

const toCreate = {
  headers,
  params: param,
  payload: Joi.object({
    title: Joi.string().required().min(5),
    description: Joi.string().required().min(10),
    value: Joi.number().min(0),
  }),
};

const toIndex = {
  headers,
  params: param,
  query: Joi.object({
    page: Joi.number(),
    onlyActive: Joi.boolean(),
  }),
};

const toUpdate = {
  headers,
  params,
  payload: Joi.object({
    title: Joi.string().min(5),
    description: Joi.string().min(10),
    value: Joi.number().min(0),
    active: Joi.boolean(),
  }),
};

const toShow = {
  headers,
  params,
};

const toDelete = {
  headers,
  params,
};

module.exports = {
  toGetAll,
  toCreate,
  toIndex,
  toShow,
  toUpdate,
  toDelete,
};
