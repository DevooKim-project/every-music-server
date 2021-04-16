const httpStatus = require("http-status");

const { authTypes } = require("../../config/type");
const catchAsync = require("../../utils/catchAsync");
const { switchAuthPlatform } = require("../../utils/switchPlatform");
const { userService, tokenService } = require("../../services");

const obtainOAuth = (type) =>
  catchAsync(async (req, res) => {
    const controller = switchAuthPlatform(req.params.platform);
    return controller.obtainOAuth(type)(req, res);
  });

const login = catchAsync(async (req, res) => {
  const controller = switchAuthPlatform(req.params.platform);
  return controller.login(authTypes.LOGIN)(req, res);
});

const getOnlyPlatformToken = catchAsync(async (req, res) => {
  const controller = switchAuthPlatform(req.params.platform);
  return controller.getOnlyToken(authTypes.TOKEN)(req, res);
});

const loginWithUserId = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.payload.id);
  const localToken = await tokenService.generateLocalToken(user);

  res.clearCookie("refreshToken");
  res.cookie("refreshToken", localToken.refreshToken, {
    // httpOnly: true, //JS에서 쿠키 접근 불가능
    // secure: true, //https에서만 쿠키 생성
    // expires: new Date(Date.now() + 2592000) //unixTime: 1month
    // signed: true,
  });

  res.send({ accessToken: localToken.accessToken });
});

const signOut = catchAsync(async (req, res) => {});

// const platform = req.params.platform
// if(platform === platformTypes.GOOGLE) {}

// if (platform === platformTypes.SPOTIFY) {}

// if(platform === platformTypes.KAKAO){}

module.exports = {
  obtainOAuth,
  login,
  loginWithUserId,
  getOnlyPlatformToken,
  signOut,
};
