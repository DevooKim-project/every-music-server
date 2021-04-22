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

const uploadPlaylist = catchAsync(async (req, res) => {
  const { playlists, trackIds } = req.body;
  const { userId } = req.payload;

  const results = [];
  for (let i = 0; i < playlists.length; i++) {
    const result = await playlistsService.createPlaylist({
      playlist: playlists[i],
      tracks: trackIds[i],
      user: userId,
    });
    results.push(result);
  }

  res.send(result);
});

const likePlaylist = catchAsync(async (req, res) => {
  const { playlistId, operator } = req.params;
  const { userId } = req.payload;

  await playlistService.likePlaylist({ playlistId, userId }, operator);
  res.status(httpStatus.NO_CONTENT).send();
});

const updatePlaylistOptions = catchAsync(async (req, res) => {
  const update = pick[(req.body, ["title", "description", "thumbnail", "private"])];
  const filter = { id: req.params.playlistId, owner: req.payload.userId };
  await playlistService.updatePlaylistOptions(filter, update);
  res.status(httpStatus.NO_CONTENT).send();
});

const deletePlaylist = catchAsync(async (req, res) => {
  await playlistService.deletePlaylistById(req.params.playlistId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getPlaylists,
  uploadPlaylist,
  likePlaylist,
  updatePlaylistOptions,
  deletePlaylist,
};
