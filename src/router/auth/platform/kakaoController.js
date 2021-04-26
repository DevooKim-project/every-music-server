const httpStatus = require("http-status");
const { platformTypes } = require("../../../config/type");
const { kakaoService, userService } = require("../../../services");

const obtainOAuth = (type) => (req, res) => {
  const oAuthUri = kakaoService.getOAuthUrl(type);
  res.redirect(oAuthUri);
};

const login = (type) => async (req, res) => {
  const platformToken = await kakaoService.getPlatformToken(
    req.query.code,
    type
  );
  //check scope

  const profile = await kakaoService.getProfile(platformToken.access_token);
  const account = profile.kakao_account;
  const userBody = {
    email: account.email,
    nick: account.profile.nickname,
    platform: platformTypes.KAKAO,
    platformId: profile.id,
  };
  const platformTokenBody = {
    accessToken: platformToken.access_token,
    refreshToken: platformToken.refresh_token,
  };
  const localToken = await userService.login(
    userBody,
    platformTypes.KAKAO,
    platformTokenBody
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

const signOut = async (req, res) => {
  await kakaoService.signOut(req.payload.platformId);
  await userService.deleteUserWithTokenAndPlaylistById(req.payload.id);
  res.clearCookie("refreshToken");
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  obtainOAuth,
  login,
  signOut,
};
