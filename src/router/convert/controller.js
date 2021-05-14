const { switchConvertPlatform } = require("../../utils/switchPlatform");
const catchAsync = require("../../utils/catchAsync");
const { tokenService } = require("../../services");
const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");

const getPlatformTokenByUserId = catchAsync(async (req, res, next) => {
  const platformToken = await tokenService.getPlatformTokenByUserId(req.payload.id, req.params.platform);
  if (!platformToken.accessToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED);
  }
  req.platformToken = platformToken;
  return next();
});
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

module.exports = {
  getPlatformTokenByUserId,
  getPlaylistFromPlatform,
  getItemFromPlatform,
  convertPlaylist,
};
