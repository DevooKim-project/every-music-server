const httpStatus = require("http-status");
const { platformTypes } = require("../../../config/type");
const { spotifyService, userService, tokenService } = require("../../../services");
const { refreshAccessToken } = require("../../../services/spotifyService");
const { getPlatformTokenByUserId, setPlatformToken } = require("../../../services/tokenService");

const login = async (req, res) => {
  const platformToken = await spotifyService.getPlatformToken(req.query);
  const profile = await spotifyService.getProfile(platformToken.access_token);

  const platformTokenBody = {
    accessToken: platformToken.access_token,
    refreshToken: platformToken.refresh_token,
    expiresIn: platformToken.expires_in,
  };
  const userBody = {
    email: profile.email,
    nick: profile.display_name,
    platform: platformTypes.SPOTIFY,
    platformId: profile.id,
  };
  const { accessToken, refreshToken, expiresIn } = await userService.login(
    userBody,
    platformTypes.SPOTIFY,
    platformTokenBody
  );

  res.clearCookie("refreshToken");
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //JS에서 쿠키 접근 불가능
    // secure: true, //https에서만 쿠키 생성
    expires: new Date(Date.now() + 2592000), //unixTime: 1month
    signed: true,
  });

  res.json({ accessToken, expiresIn });
};

const generateToken = async (req, res) => {
  const platformToken = await spotifyService.getPlatformToken(req.query);
  const platformTokenBody = {
    accessToken: platformToken.access_token,
    refreshToken: platformToken.refresh_token,
    expiresIn: platformToken.expires_in,
  };
  await tokenService.setPlatformToken(req.payload.id, platformTypes.SPOTIFY, platformTokenBody);

  res.send();
};

const refreshToken = async (req, res) => {
  const { refreshToken } = await getPlatformTokenByUserId(req.payload.id, platformTypes.SPOTIFY);
  if (!refreshToken) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found spotify refreshToken");
  }

  const platformToken = await refreshAccessToken(refreshToken);
  const platformTokenBody = {
    accessToken: platformToken.access_token,
    expiresIn: platformToken.expires_in,
  };
  await setPlatformToken(req.payload.id, platformTypes.SPOTIFY, platformTokenBody);
  res.status(httpStatus.NO_CONTENT).send();
};

const signOut = async (req, res) => {
  await userService.deleteUserWithTokenAndPlaylistById(req.payload.id);
  res.clearCookie("refreshToken");
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  login,
  generateToken,
  refreshToken,
  signOut,
};
