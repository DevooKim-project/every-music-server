const { switchConvertPlatform } = require("../../utils/switchPlatform");
const catchAsync = require("../../utils/catchAsync");
const { tokenService } = require("../../services");
const { platformTypes } = require("../../config/type");

const getPlatformTokenByUserId = async (req, res, next) => {
  const platformToken = await tokenService.findPlatformTokenByUserId(
    req.payload.id,
    platformTypes.SPOTIFY
  );
  req.platformToken = platformToken;
  return next();
};
const getPlaylistsFromPlatform = catchAsync(async (req, res) => {
  const controller = switchConvertPlatform(req.params.platform);
  return controller.getPlaylistsFromPlatform(req, res);
});

const getTracksFromPlatform = catchAsync((req, res) => {
  const controller = switchConvertPlatform(req.params.platform);
  return controller.getTracksFromPlatform(req, res);
});

const uploadPlaylistsToLocal = catchAsync(async (req, res) => {
  // const user_id = req.payload.user_id;
  // const { playlists, track_ids } = req.body;
  // for (let i = 0; i < playlists.length; i++) {
  //   await uploadPlaylist({
  //     playlist: playlists[i],
  //     track_ids: track_ids[i],
  //     user_id: user_id,
  //   });
  // }
  // res.send("fin");
});

module.exports = {
  getPlatformTokenByUserId,
  getPlaylistsFromPlatform,
  getTracksFromPlatform,
  uploadPlaylistsToLocal,
};
