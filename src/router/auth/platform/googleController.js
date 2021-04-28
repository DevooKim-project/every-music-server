const httpStatus = require("http-status");
const { platformTypes } = require("../../../config/type");
const { googleService, userService, tokenService } = require("../../../services");

const obtainOAuth = (type) => (req, res) => {
  const oAuthUri = googleService.getOAuthUrl(type);
  res.redirect(oAuthUri);
};

const login = (type) => async (req, res) => {
  console.log("query: ", req.query);
  const platformToken = await googleService.getPlatformToken(req.query.code, type);

  const profile = googleService.getProfile(platformToken.id_token);
  const userBody = {
    email: profile.email,
    nick: profile.name,
    platform: platformTypes.GOOGLE,
    platformId: profile.sub,
  };
  const platformTokenBody = {
    accessToken: platformToken.access_token,
    refreshToken: platformToken.refresh_token,
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

const getOnlyToken = (type) => async (req, res) => {
  const payload = req.payload;
  const platformToken = await googleService.getPlatformToken(req.query.code, type);
  const platformTokenBody = {
    accessToken: platformToken.access_token,
    refreshToken: platformToken.refresh_token,
  };
  await tokenService.upsertPlatformToken(payload.id, platformTypes.GOOGLE, platformTokenBody);
  res.status(httpStatus.NO_CONTENT).send();
};

const signOut = async (req, res) => {
  await userService.deleteUserWithTokenAndPlaylistById(req.payload.id);
  res.clearCookie("refreshToken");
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  obtainOAuth,
  login,
  getOnlyToken,
  signOut,
};
