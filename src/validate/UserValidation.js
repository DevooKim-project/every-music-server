const Joi = require("joi");

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

module.exports = { getUser };
