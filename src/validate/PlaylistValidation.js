const Joi = require("joi");
const { likeTypes, platformTypes } = require("../config/type");

// const playlist = {
//   playlist: Joi.array().items(
//     Joi.object().keys({
//       // platformId: Joi.string().required(),
//       // platform: Joi.string().required(),
//       id: Joi.string().required(),
//       provider: Joi.string().required(),
//       title: Joi.string().required(),
//       thumbnail: Joi.string(),
//       description: Joi.string(),
//       owner: Joi.object().keys({
//         name: Joi.string().required(),
//         id: Joi.string().required(),
//       }),
//     })
//   ),
// };

// const track = {
//   tracks: Joi.object().keys({
//     title: Joi.string().required(),
//     ids: Joi.object()
//       .required()
//       .keys({
//         local: Joi.string(),
//         google: Joi.string(),
//         spotify: Joi.string(),
//       })
//       .or(platformTypes.LOCAL, platformTypes.GOOGLE, platformTypes.SPOTIFY),
//     artist: Joi.object()
//       .required()
//       .keys({
//         name: Joi.string(),
//         ids: Joi.object()
//           .required()
//           .keys({
//             local: Joi.string(),
//             google: Joi.string(),
//             spotify: Joi.string(),
//           })
//           .or(platformTypes.LOCAL, platformTypes.GOOGLE, platformTypes.SPOTIFY),
//       }),
//     thumbnail: Joi.string(),
//   }),
// };

// const platform = {
//   platform: Joi.string()
//     .required()
//     .valid(platformTypes.GOOGLE, platformTypes.SPOTIFY),
// };

// const playlistId = Joi.string().required();

// const getTrackFromPlaylist = {
//   params: {
//     platform,
//   },
//   body: {
//     playlists: Joi.array().required().items(playlist),
//   },
// };

// const convert = {
//   body: Joi.object().keys({
//     playlists: Joi.array().required().items(playlist),
//     tracks: Joi.array().required().items(track),
//   }),
// };
const playlistBody = Joi.object()
  .keys({
    // platformId: Joi.string().required(),
    // platform: Joi.string().required(),
    platformId: Joi.string(),
    platform: Joi.string().valid(platformTypes.GOOGLE, platformTypes.SPOTIFY),
    title: Joi.string().required(),
    thumbnail: Joi.string().allow(null, ""),
    description: Joi.string().allow(null, ""),
    owner: Joi.object(),
  })
  .or("title");

const getPlaylists = {
  query: Joi.object().keys({
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
  }),
};

const getPlaylistsByUser = {
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
    playlists: Joi.array().items(playlistBody.required()).required(),
    tracks: Joi.array().required(),
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

const getTrack = {
  params: Joi.object().keys({
    playlistId: Joi.string().required(),
  }),
};

module.exports = {
  getPlaylists,
  getPlaylistsByUser,
  uploadPlaylist,
  likePlaylist,
  updatePlaylist,
  deletePlaylist,
  getTrack,
};
