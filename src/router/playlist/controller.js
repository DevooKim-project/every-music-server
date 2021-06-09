const httpStatus = require("http-status");

const catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const { playlistService } = require("../../services");

const getPlaylist = catchAsync(async (req, res) => {
  const playlist = await playlistService.getPlaylistWithTrack(req.params.playlistId);
  res.send(playlist);
});

const getPlaylists = catchAsync(async (req, res) => {
  const options = pick(req.query, ["page", "limit", "sort"]);
  options.sort = JSON.parse(options.sort);
  const filter = { visible: true };
  const result = await playlistService.queryPlaylists(filter, options);
  res.send(result);
});

const getPlaylistsByUser = catchAsync(async (req, res) => {
  const options = pick(req.query, ["page", "limit"]);
  const visibleOption = playlistService.setVisibleOption(req);
  const filter = { owner: req.params.userId, ...visibleOption };
  const result = await playlistService.queryPlaylists(filter, options);
  res.send(result);
});

const uploadPlaylist = catchAsync(async (req, res) => {
  const { playlists, tracks } = req.body;
  const { id } = req.payload;

  const results = [];
  for (let i = 0; i < playlists.length; i++) {
    const result = await playlistService.createPlaylist({
      playlist: playlists[i],
      tracks: tracks[i],
      user: id,
    });
    results.push(result);
  }

  res.send(results);
});

const likePlaylist = catchAsync(async (req, res) => {
  const { playlistId, operator } = req.params;
  const { id } = req.payload;

  await playlistService.likePlaylist({ playlistId, userId: id }, operator);
  res.status(httpStatus.NO_CONTENT).send();
});

const updatePlaylistOptions = catchAsync(async (req, res) => {
  const update = pick(req.body, ["title", "description", "thumbnail", "visible"]);
  const filter = { _id: req.params.playlistId, owner: req.payload.id };
  const playlist = await playlistService.updatePlaylistOptions(filter, update);
  // await playlist.execPopulate("owner");
  // res.status(httpStatus.NO_CONTENT).send();
  res.send(playlist);
});

const deletePlaylist = catchAsync(async (req, res) => {
  await playlistService.deletePlaylistById(req.payload.id, req.params.playlistId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getPlaylist,
  getPlaylists,
  getPlaylistsByUser,
  uploadPlaylist,
  likePlaylist,
  updatePlaylistOptions,
  deletePlaylist,
};
