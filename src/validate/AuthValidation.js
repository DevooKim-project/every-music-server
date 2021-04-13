const Joi = require("joi");

const oAuthPlatform = {
  params: Joi.object().keys({
    platform: Joi.string().required().valid("spotify", "kakao", "google"),
  }),
};

const accessToken = {
  authori,
};

const refreshPlatform = {
  params: Joi.object().keys({
    platform: Joi.string().required().valid("local", "spotify", "google"),
  }),
};

module.exports = { oAuthPlatform, refreshPlatform };
