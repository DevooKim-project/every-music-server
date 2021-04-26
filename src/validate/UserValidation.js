const Joi = require("joi");

const userId = {
  params: {
    userId: Joi.string().required(),
  },
  query: {
    maxResult: Joi.number().max(50),
    lastId: Joi.string(),
  },
};

module.exports = { userId };
