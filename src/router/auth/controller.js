const { authTypes } = require("../../config/type");
const catchAsync = require("../../utils/catchAsync");
const { switchAuthPlatform } = require("../../utils/switchPlatform");
const { userService, tokenService } = require("../../services");

const obtainOAuth = (type) =>
  catchAsync((req, res) => {
    const controller = switchAuthPlatform(req.params.platform);
    console.log(controller);
    return controller.obtainOAuth(type)(req, res);
  });

const login = catchAsync((req, res) => {
  const controller = switchAuthPlatform(req.params.platform);
  return controller.login(authTypes.LOGIN)(req, res);
});

const getOnlyPlatformToken = catchAsync((req, res) => {
  const controller = switchAuthPlatform(req.params.platform);
  return controller.getOnlyToken(authTypes.TOKEN)(req, res);
});

const loginWithUserId = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.payload.id);
  const localToken = await tokenService.generateLocalToken(user);

  res.clearCookie("refreshToken");
  res.cookie("refreshToken", localToken.refreshToken, {
    httpOnly: true, //JS에서 쿠키 접근 불가능
    // secure: true, //https에서만 쿠키 생성
    expires: new Date(Date.now() + 2592000), //unixTime: 1month
    signed: true,
  });

  res.send({ accessToken: localToken.accessToken });
});

const signOut = catchAsync((req, res) => {
  const controller = switchAuthPlatform(req.params.platform);
  return controller.signOut(req, res);
});

module.exports = {
  obtainOAuth,
  login,
  loginWithUserId,
  getOnlyPlatformToken,
  signOut,
};
