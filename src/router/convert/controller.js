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
const getPlaylistFromPlatform = catchAsync(async (req, res) => {
  const controller = switchConvertPlatform(req.params.platform);
  return controller.getPlaylistFromPlatform(req, res);
});

const getItemFromPlatform = catchAsync((req, res) => {
  const controller = switchConvertPlatform(req.params.platform);
  return controller.getItemFromPlatform(req, res);
});

const convertPlaylist = catchAsync(async (req, res) => {
  const controller = switchConvertPlatform(req.params.platform);
  return controller.createPlaylistToPlatform(req, res);
});

const uploadPlaylistsToLocal = catchAsync(async (req, res) => {
  // const userid = req.payload.userid;
  // const { playlists, trackids } = req.body;
  // for (let i = 0; i < playlists.length; i++) {
  //   await uploadPlaylist({
  //     playlist: playlists[i],
  //     trackids: trackids[i],
  //     userid: userid,
  //   });
  // }
  // res.send("fin");
});

module.exports = {
  getPlatformTokenByUserId,
  getPlaylistFromPlatform,
  getItemFromPlatform,
  convertPlaylist,
  uploadPlaylistsToLocal,
};
