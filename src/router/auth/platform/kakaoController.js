const httpStatus = require("http-status");
const { platformTypes } = require("../../../config/type");
const { kakaoService, userService } = require("../../../services");
const { refreshAccessToken } = require("../../../services/kakaoService");
const { getPlatformTokenByUserId, setPlatformToken } = require("../../../services/tokenService");
const ApiError = require("../../../utils/ApiError");

const login = async (req, res) => {
  const platformToken = await kakaoService.getPlatformToken(req.query);

  const profile = await kakaoService.getProfile(platformToken.access_token);
  const account = profile.kakao_account;
  const userBody = {
    email: account.email,
    nick: account.profile.nickname,
    image: account.profile.thumbnail_image_url,
    platform: platformTypes.KAKAO,
    platformId: profile.id,
  };
  const platformTokenBody = {
    accessToken: platformToken.access_token,
    refreshToken: platformToken.refresh_token,
    expiresIn: platformToken.expires_in,
    refreshTokenExpiresIn: platformToken.refresh_token_expires_in,
  };
  const { accessToken, refreshToken, expiresIn } = await userService.login(
    userBody,
    platformTypes.KAKAO,
    platformTokenBody
  );

  res.clearCookie("refreshToken");
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //JS에서 쿠키 접근 불가능
    secure: true, //https에서만 쿠키 생성
    expires: new Date(Date.now() + 2592000), //unixTime: 1month
    signed: true,
  });

  res.json({ accessToken, expiresIn });
};

const refreshToken = async (req, res) => {
  const { refreshToken } = await getPlatformTokenByUserId(req.payload.id, platformTypes.KAKAO);
  if (!refreshToken) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found kakao refreshToken");
  }

  const platformToken = await refreshAccessToken(refreshToken);
  const platformTokenBody = {
    accessToken: platformToken.access_token,
    expiresIn: platformToken.expires_in,
  };
  await setPlatformToken(req.payload.id, platformTypes.KAKAO, platformTokenBody);
  res.status(httpStatus.NO_CONTENT).send();
};

const signOut = async (req, res) => {
  const signOutPromise = kakaoService.signOut(req.payload.platformId);
  const deletePromise = userService.deleteUserWithTokenAndPlaylistById(req.payload.id);

  await Promise.all([signOutPromise, deletePromise]);
  res.clearCookie("refreshToken");
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  login,
  refreshToken,
  signOut,
};
