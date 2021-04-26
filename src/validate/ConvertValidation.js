const Joi = require("joi");
const { platformTypes } = require("../config/type");
const playlistValidation = require("./PlaylistValidation");

const convertPlatform = {
  params: Joi.object().keys({
    platform: Joi.string().required().valid(platformTypes.SPOTIFY, platformTypes.GOOGLE),
  }),
};

const getTrack = {
  body: Joi.object().keys({
    playlists: Joi.array().items(playlistValidation.playlistBody.or("platformId")),
  }),
};

const convertPlaylist = {
  body: Joi.object().keys({
    playlists: Joi.array().items(playlistValidation.playlistBody.or("title")),
    tracks: Joi.array().items(playlistValidation.trackBody),
  }),
};

module.exports = {
  convertPlatform,
  getTrack,
  convertPlaylist,
};
