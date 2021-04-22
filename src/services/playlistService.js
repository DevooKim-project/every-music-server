const { Playlist, User } = require("../database/schema");
const paginate = require("../utils/paginate");
const { likeTypes } = require("../config/type");

const createPlaylist = async (playlistBody) => {
  const { playlist, tracks, user } = playlistBody;

  const newPlaylist = await Playlist.create({
    ...playlist,
    tracks,
    owner: user,
  });
  return newPlaylist;
};

const queryPlaylists = async (filter, options) => {
  const result = await paginate(Playlist, filter, options);
  return result;
};

const likePlaylists = async (playlistBody, operator) => {
  const { playlistId, userId } = playlistBody;
  let userPromise;
  let playlistPromise;
  if (operator === likeTypes.LIKE) {
    userPromise = User.updateOne({ id: userId }, { $addToSet: { likePlaylists: playlistId } });
    playlistPromise = Playlist.updateOne({ id: playlistId }, { $inc: { like: 1 } });
  }

  if (operator === likeTypes.UNLIKE) {
    userPromise = User.updateOne({ id: userId }, { $pullAll: { likePlaylists: [playlistId] } });
    playlistPromise = Playlist.updateOne({ id: playlistId }, { $inc: { like: -1 } });
  }

  return Promise.all([userPromise, playlistPromise]);
};

const updatePlaylistOptions = async (filter, update) => {
  return await Playlist.updateOne(filter, { $set: update });
};

const deletePlaylistById = async (playlistId) => {
  await Playlist.deleteOne({ id: playlistId });
};

const deletePlaylistByUserId = async (userId) => {
  await Playlist.deleteOMany({ owner: userId });
};

const getTrack = async (playlistId) => {
  const playlist = await Playlist.findOne({ id: playlistId }).populate("tracks");
  return playlist.tracks;
};

module.exports = {
  createPlaylist,
  queryPlaylists,
  likePlaylists,
  updatePlaylistOptions,
  deletePlaylistById,
  deletePlaylistByUserId,
  getTrack,
};
