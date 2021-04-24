const httpStatus = require("http-status");

const catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const { playlistService } = require("../../services");

const getPlaylists = catchAsync(async (req, res) => {
  const options = pick(req.query, ["page", "limit"]);
  options.sort = { like: -1 };
  const filter = { private: false };
  const result = await playlistService.queryPlaylists(filter, options);
  res.send(result);
});

const getPlaylistsByUser = catchAsync(async (req, res) => {
  const options = pick(req.query, ["page", "limit"]);
  const privateOption = playlistService.setPrivateOption(req);
  const filter = { owner: req.params.userId, ...privateOption };
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
  const update = pick(req.body, ["title", "description", "thumbnail", "private"]);
  const filter = { _id: req.params.playlistId, owner: req.payload.id };
  await playlistService.updatePlaylistOptions(filter, update);
  res.status(httpStatus.NO_CONTENT).send();
});

const deletePlaylist = catchAsync(async (req, res) => {
  await playlistService.deletePlaylistById(req.params.playlistId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getPlaylists,
  getPlaylistsByUser,
  uploadPlaylist,
  likePlaylist,
  updatePlaylistOptions,
  deletePlaylist,
};
