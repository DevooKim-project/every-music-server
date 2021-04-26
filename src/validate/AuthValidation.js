const Joi = require("joi");
const { platformTypes } = require("../config/type");

const oAuthPlatform = {
  params: Joi.object().keys({
    platform: Joi.string()
      .required()
      .valid(platformTypes.GOOGLE, platformTypes.KAKAO, platformTypes.SPOTIFY),
  }),
};

const oAuth = {
  query: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

const refreshPlatform = {
  params: Joi.object().keys({
    platform: Joi.string()
      .required()
      .valid(platformTypes.LOCAL, platformTypes.GOOGLE, platformTypes.SPOTIFY),
  }),
};

module.exports = { oAuthPlatform, oAuth, refreshPlatform };
