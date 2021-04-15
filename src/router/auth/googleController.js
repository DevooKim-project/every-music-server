const httpStatus = require("http-status");
const { platformTypes } = require("../../config/type");
const { googleService, userService, tokenService } = require("../../services");

const obtainOAuth = (type) => async (req, res) => {
  const oAuthUri = await googleService.getOAuthUrl(type);
  res.redirect(oAuthUri);
};

const login = (type) => async (req, res) => {
  const platformToken = await googleService.getPlatformToken(
    req.query.code,
    type
  );
  //check scope

  const profile = googleService.getProfile(platformToken.id_token);
  const userBody = {
    email: profile.email,
    nick: profile.name,
    platform: platformTypes.GOOGLE,
    platformId: profile.sub,
  };

  const localToken = await userService.login(
    userBody,
    platformTypes.GOOGLE,
    platformToken
  );

  res.clearCookie("refreshToken");
  res.cookie("refreshToken", localToken.refreshToken, {
    // httpOnly: true, //JS에서 쿠키 접근 불가능
    // secure: true, //https에서만 쿠키 생성
    // expires: new Date(Date.now() + 2592000) //unixTime: 1month
    // signed: true,
  });

  res.send({ accessToken: localToken.accessToken });
};

const loginDirect = async (req, res) => {
  const userId = payload.id;
  const user = await userService.getUserById(userId);
  const localToken = await tokenService.generateLocalToken(
    user,
    req.headers.authorization
  );

  res.clearCookie("refreshToken");
  res.cookie("refreshToken", localToken.refreshToken, {
    // httpOnly: true, //JS에서 쿠키 접근 불가능
    // secure: true, //https에서만 쿠키 생성
    // expires: new Date(Date.now() + 2592000) //unixTime: 1month
    // signed: true,
  });

  res.send({ accessToken: localToken.accessToken });
};

const getOnlyToken = (type) => async (req, res) => {
  const payload = req.payload;
  const platformToken = await googleService.getPlatformToken(
    req.query.code,
    type
  );

  await tokenService.upsertPlatformToken(
    payload.id,
    platformTypes.GOOGLE,
    platformToken
  );
  // res.status(httpStatus.NO_CONTENT).send();
  res.send();
};

const signOut = async (req, res) => {
  const payload = req.payload;
  userService.deleteUserWithTokenAndPlaylistById(payload.id),
    // Promise.all([
    // googleService.revoke(payload.id),
    // ]);
    res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  obtainOAuth,
  login,
  loginDirect,
  getOnlyToken,
  signOut,
};
