const Joi = require("joi");

const playlist = {
  playlist: Joi.array().items(
    Joi.object().keys({
      // platformId: Joi.string().required(),
      // platform: Joi.string().required(),
      id: Joi.string().required(),
      provider: Joi.string().required(),
      title: Joi.string().required(),
      thumbnail: Joi.string(),
      description: Joi.string(),
      owner: Joi.object().keys({
        name: Joi.string().required(),
        id: Joi.string().required(),
      }),
    })
  ),
};

const track = {
  tracks: Joi.object().keys({
    title: Joi.string().required(),
    ids: Joi.object()
      .required()
      .keys({
        local: Joi.string(),
        youtube: Joi.string(),
        spotify: Joi.string(),
      })
      .or("local", "youtube", "spotify"),
    artist: Joi.object()
      .required()
      .keys({
        name: Joi.string(),
        ids: Joi.object()
          .required()
          .keys({
            local: Joi.string(),
            youtube: Joi.string(),
            spotify: Joi.string(),
          })
          .or("local", "youtube", "spotify"),
      }),
    thumbnail: Joi.string(),
  }),
};

const platform = {
  platform: Joi.string().required().valid("spotify", "youtube"),
};

const playlistId = Joi.string().required();

const getTrackFromPlaylist = {
  params: {
    platform,
  },
  body: {
    playlists: Joi.array().required().items(playlist),
  },
};

const convert = {
  body: Joi.object().keys({
    playlists: Joi.array().required().items(playlist),
    tracks: Joi.array().required().items(track),
  }),
};

const upload = {
  body: Joi.object().keys({
    playlists: Joi.array().required().items(playlist),
    trackIds: Joi.array().required().items(Joi.string()),
  }),
};

const update = {
  params: Joi.object().keys({
    playlistId,
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    thumbnail: Joi.string(),
    private: Joi.boolean(),
  }),
};

const like = {
  params: Joi.object().keys({
    playlistId,
    operator: Joi.string().required().valid("like", "unlike"),
  }),
};

const searchAll = {
  query: Joi.object().keys({
    maxResult: Joi.number().max(50),
    lastId: Joi.string(),
  }),
};
module.exports = {
  getTrackFromPlaylist,
  convert,
  upload,
  update,
  searchAll,
  like,
  playlistId,
};
