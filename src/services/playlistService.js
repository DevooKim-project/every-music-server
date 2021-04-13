const { Playlist } = require("../database/schema");

const getPlaylistById = async (id) => {
  return Playlist.findById(id);
};

const deletePlaylistById = async (playlistId) => {
  await Playlist.deleteOne({ id: playlistId });
};

const deletePlaylistByUserId = async (userId) => {
  await Playlist.deleteOMany({ owner: userId });
};

module.exports = {
  getPlaylistById,
  deletePlaylistById,
  deletePlaylistByUserId,
};
