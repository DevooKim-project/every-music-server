const { Playlist, User } = require("../database/schema");
const paginate = require("../utils/paginate");
const { likeTypes } = require("../config/type");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

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
  const result = await paginate(Playlist, filter, options, "owner");

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
  return await Playlist.findOneAndUpdate(filter, { $set: update }, { new: true });
};

const deletePlaylistById = async (userId, playlistId) => {
  const playlist = await getPlaylistById(playlistId);
  if (!playlist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Playlist not found");
  }

  if (playlist.owner.toString() === userId) {
    return await playlist.remove();
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, "This user are not have playlist");
  }
};

const deletePlaylistByUserId = async (userId) => {
  await Playlist.deleteMany({ owner: userId });
};

const getPlaylistById = async (id, path = undefined) => {
  return await Playlist.findById(id).populate(path);
};

const getTrack = async (playlistId) => {
  const path = [{ path: "tracks", populate: { path: "artist", model: "Artist" } }, { path: "owner" }];
  const playlist = await getPlaylistById(playlistId, path);

  return playlist;
};

const setVisibleOption = (req) => {
  if (req.payload && req.payload.id === req.params.userId) {
    return { $or: [{ visible: true }, { visible: false }] };
  } else {
    return { visible: true };
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
  getTrack,
  setVisibleOption,
};
