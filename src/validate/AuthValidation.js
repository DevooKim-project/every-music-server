const Joi = require("joi");
const { authTypes, platformTypes } = require("../config/type");

const oAuthPlatform = {
  params: Joi.object().keys({
    platform: Joi.string()
      .required()
      .valid(platformTypes.GOOGLE, platformTypes.KAKAO, platformTypes.SPOTIFY),
  }),
};

const oAuthType = {
  params: Joi.object().keys({
    type: Joi.string().required().valid(authTypes.REGISTER, authTypes.TOKEN),
  }),
};

const refreshPlatform = {
  params: Joi.object().keys({
    platform: Joi.string()
      .required()
      .valid(platformTypes.LOCAL, platformTypes.GOOGLE, platformTypes.SPOTIFY),
  }),
};

module.exports = { oAuthPlatform, oAuthType, refreshPlatform };
