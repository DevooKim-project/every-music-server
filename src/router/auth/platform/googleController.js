const httpStatus = require("http-status");
const { platformTypes } = require("../../../config/type");
const { googleService, userService, tokenService } = require("../../../services");
const catchAsync = require("../../../utils/catchAsync");

const login = async (req, res) => {
  const platformToken = await googleService.getPlatformToken(req.query);
  const profile = googleService.getProfile(platformToken.id_token);

  const platformTokenBody = {
    accessToken: platformToken.access_token,
    refreshToken: platformToken.refresh_token,
  };
  const userBody = {
    email: profile.email,
    nick: profile.name,
    platform: platformTypes.GOOGLE,
    platformId: profile.sub,
  };
  const { accessToken, refreshToken, expiresIn } = await userService.login(
    userBody,
    platformTypes.GOOGLE,
    platformTokenBody
  );

  res.clearCookie("refreshToken");
  res.cookie("refreshToken", refreshToken, {
    // httpOnly: true, //JS에서 쿠키 접근 불가능
    // secure: true, //https에서만 쿠키 생성
    expires: new Date(Date.now() + 2592000), //unixTime: 1month
    signed: true,
  });
  console.log("token: ", accessToken);
  res.json({ accessToken, expiresIn });
};

const getOnlyToken = async (req, res) => {
  const payload = req.payload;
  const platformToken = await googleService.getPlatformToken(req.query);
  const platformTokenBody = {
    accessToken: platformToken.access_token,
    refreshToken: platformToken.refresh_token,
    expiresIn: platformToken.expires_in,
  };
  await tokenService.setPlatformToken(payload.id, platformTypes.GOOGLE, platformTokenBody);
  res.status(httpStatus.NO_CONTENT).send();
};

const signOut = async (req, res) => {
  await userService.deleteUserWithTokenAndPlaylistById(req.payload.id);
  res.clearCookie("refreshToken");
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  login,
  getOnlyToken,
  signOut,
};
