const Joi = require("joi");
const { likeTypes, platformTypes } = require("../config/type");

const platformIdsBody = Joi.object().keys({
  google: Joi.string().allow(null, ""),
  spotify: Joi.string().allow(null, ""),
  local: Joi.string().allow(null, ""),
});

const artistBody = Joi.object().keys({
  name: Joi.string(),
  platformIds: platformIdsBody.or(platformTypes.LOCAL),
});

const playlistBody = Joi.object().keys({
  platformId: Joi.string(),
  platform: Joi.string().valid(platformTypes.GOOGLE, platformTypes.SPOTIFY),
  title: Joi.string(),
  thumbnail: Joi.string().allow(null, ""),
  description: Joi.string().allow(null, ""),
  owner: Joi.object(),
});

const trackBody = Joi.array().items(
  Joi.object().keys({
    title: Joi.string(),
    platformIds: platformIdsBody.or(platformTypes.LOCAL),
    artist: artistBody.or("name", "platformIds"),
    thumbnail: Joi.string(),
  })
);

const readPlaylists = {
  query: Joi.object().keys({
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
  }),
};

const readPlaylistsByUser = {
  query: Joi.object().keys({
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
  }),
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const uploadPlaylist = {
  body: Joi.object().keys({
    playlists: Joi.array().items(playlistBody.or("title")),
    tracks: Joi.array().items(trackBody),
  }),
};

const likePlaylist = {
  params: Joi.object().keys({
    playlistId: Joi.string().required(),
    operator: Joi.string().valid(likeTypes.LIKE, likeTypes.UNLIKE).required(),
  }),
};

const updatePlaylist = {
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
      thumbnail: Joi.string(),
      private: Joi.boolean(),
    })
    .min(1),
};

const deletePlaylist = {
  params: Joi.object().keys({
    playlistId: Joi.string().required(),
  }),
};

const readTrack = {
  params: Joi.object().keys({
    playlistId: Joi.string().required(),
  }),
};

module.exports = {
  platformIdsBody,
  artistBody,
  playlistBody,
  trackBody,
  readPlaylists,
  readPlaylistsByUser,
  uploadPlaylist,
  likePlaylist,
  updatePlaylist,
  deletePlaylist,
  readTrack,
};
