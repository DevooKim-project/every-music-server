const Joi = require("joi");
const { platformTypes, authTypes } = require("../config/type");

const oAuthPlatform = {
  params: Joi.object().keys({
    platform: Joi.string().required().valid(platformTypes.GOOGLE, platformTypes.KAKAO, platformTypes.SPOTIFY),
  }),
};

const oAuthToken = {
  query: Joi.object().keys({
    code: Joi.string().required(),
    // type: Joi.string().required().valid(authTypes.LOGIN, authTypes.TOKEN),
    redirectUri: Joi.string().required(),
  }),
};

module.exports = { oAuthPlatform, oAuthToken };
