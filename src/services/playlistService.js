const { Playlist, User } = require("../database/schema");
const paginate = require("../utils/paginate");
const { likeTypes } = require("../config/type");

const createPlaylist = async (playlistBody) => {
  const { playlist, tracks, user } = playlistBody;
  const trackIds = tracks.map((track) => {
    return track.platformIds.local;
  });

  const newPlaylist = await Playlist.create({
    ...playlist,
    tracks: trackIds,
    owner: user,
  });
  return newPlaylist.execPopulate("tracks");
};

const queryPlaylists = async (filter, options) => {
  const result = await paginate(Playlist, filter, options);
  return result;
};

const likePlaylist = async (playlistBody, operator) => {
  const { playlistId, userId } = playlistBody;
  let userPromise;
  let playlistPromise;
  if (operator === likeTypes.LIKE) {
    userPromise = User.updateOne({ _id: userId }, { $addToSet: { likePlaylists: playlistId } });
    playlistPromise = Playlist.updateOne({ _id: playlistId }, { $inc: { like: 1 } });
  }

  if (operator === likeTypes.UNLIKE) {
    userPromise = User.updateOne({ _id: userId }, { $pullAll: { likePlaylists: [playlistId] } });
    playlistPromise = Playlist.updateOne({ _id: playlistId }, { $inc: { like: -1 } });
  }

  return Promise.all([userPromise, playlistPromise]);
};

const updatePlaylistOptions = async (filter, update) => {
  return await Playlist.updateOne(filter, { $set: update });
};

const deletePlaylistById = async (playlistId) => {
  await Playlist.deleteOne({ _id: playlistId });
};

const deletePlaylistByUserId = async (userId) => {
  await Playlist.deleteOMany({ owner: userId });
};

const getPlaylistById = async (id) => {
  return await Playlist.findById(id);
};

const getLibrary = async (playlistId) => {
  return await Playlist.find({ _id: { $in: playlistId } });
};

const getTrack = async (playlistId) => {
  const playlist = await getPlaylistById(playlistId);
  await playlist.execPopulate("tracks");
  return playlist.tracks;
};

const setPrivateOption = (req) => {
  if (req.payload && req.payload.id === req.params.userId) {
    return { $or: [{ private: true }, { private: false }] };
  } else {
    return { private: false };
  }
};

module.exports = {
  createPlaylist,
  queryPlaylists,
  likePlaylist,
  updatePlaylistOptions,
  deletePlaylistById,
  deletePlaylistByUserId,
  getPlaylistById,
  getLibrary,
  getTrack,
  setPrivateOption,
};
