const Joi = require("joi");

const convertPlatform = {
  params: Joi.object().keys({
    platform: Joi.string().required().valid("spotify", "youtube"),
  }),
};

module.exports = { convertPlatform };
