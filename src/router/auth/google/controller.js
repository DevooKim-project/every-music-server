const httpStatus = require("http-status");
const { tokenTypes, platformTypes } = require("../../../config/type");
const catchAsync = require("../../../utils/catchAsync");
const {
  googleService,
  userService,
  tokenService,
} = require("../../../services");

const obtainOAuth = (type) =>
  catchAsync(async (req, res) => {
    const oAuthUri = await googleService.getOAuthUrl(type);
    res.redirect(oAuthUri);
  });

const login = (type) =>
  catchAsync(async (req, res) => {
    const platformToken = await googleService.getPlatformToken(
      req.query.code,
      type
    );
    //check scope

    const profile = googleService.getProfile(platformToken);
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

    await tokenService.refreshToken("6075e1d78eaf110bda8af2a6", "local");
    res.send({ accessToken: localToken.accessToken });
  });

const signOut = catchAsync(async (req, res) => {
  const payload = tokenService.verifyToken(req, tokenTypes.ACCESS);

  Promise.all([
    googleService.revoke(payload.userId),
    userService.deleteUserWithTokenAndPlaylistById(userId),
  ]);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  obtainOAuth,
  login,
  signOut,
};
