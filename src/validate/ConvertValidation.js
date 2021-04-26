const Joi = require("joi");
const { platformTypes } = require("../config/type");

const convertPlatform = {
  params: Joi.object().keys({
    platform: Joi.string()
      .required()
      .valid(platformTypes.SPOTIFY, platformTypes.GOOGLE),
  }),
};

module.exports = { convertPlatform };
