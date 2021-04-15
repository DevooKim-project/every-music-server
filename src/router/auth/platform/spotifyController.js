const httpStatus = require("http-status");
const { platformTypes } = require("../../../config/type");
const {
  spotifyService,
  userService,
  tokenService,
} = require("../../../services");

const obtainOAuth = (type) => async (req, res) => {
  const oAuthUri = await spotifyService.getOAuthUrl(type);
  res.redirect(oAuthUri);
};

const login = (type) => async (req, res) => {
  const platformToken = await spotifyService.getPlatformToken(
    req.query.code,
    type
  );

  const profile = await spotifyService.getProfile(platformToken.access_token);
  const userBody = {
    email: profile.email,
    nick: profile.name,
    platform: platformTypes.SPOTIFY,
    platformId: profile.sub,
  };

  const localToken = await userService.login(
    userBody,
    platformTypes.SPOTIFY,
    platformToken
  );

  res.clearCookie("refreshToken");
  res.cookie("refreshToken", localToken.refreshToken, {
    // httpOnly: true, //JS에서 쿠키 접근 불가능
    // secure: true, //https에서만 쿠키 생성
    // expires: new Date(Date.now() + 2592000) //unixTime: 1month
    // signed: true,
  });

  console.log("localToken: ", localToken);
  res.send({ accessToken: localToken.accessToken });
};

const getOnlyToken = (type) => async (req, res) => {
  const payload = req.payload;
  const platformToken = await spotifyService.getPlatformToken(
    req.query.code,
    type
  );

  await tokenService.upsertPlatformToken(
    payload.id,
    platformTypes.SPOTIFY,
    platformToken
  );
  // res.status(httpStatus.NO_CONTENT).send();
  res.send();
};

module.exports = { obtainOAuth, login, getOnlyToken };
