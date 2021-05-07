const { authTypes } = require("../../config/type");
const catchAsync = require("../../utils/catchAsync");
const { switchAuthPlatform } = require("../../utils/switchPlatform");
const { userService, tokenService } = require("../../services");

const login = catchAsync((req, res) => {
  const controller = switchAuthPlatform(req.params.platform);
  return controller.login(req, res);
});

const getOnlyPlatformToken = catchAsync((req, res) => {
  const controller = switchAuthPlatform(req.params.platform);
  return controller.getOnlyToken(req, res);
});

const hasPlatformToken = catchAsync(async (req, res) => {
  const hasToken = await tokenService.hasPlatformToken(req.payload.id, req.params.platform);
  return res.send({ platformToken: hasToken });
});

const loginWithUserId = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.payload.id);
  const { accessToken, refreshToken, expiresIn } = await tokenService.generateLocalToken(user);

  res.clearCookie("refreshToken");
  res.cookie("refreshToken", refreshToken, {
    // httpOnly: true, //JS에서 쿠키 접근 불가능
    // secure: true, //https에서만 쿠키 생성
    expires: new Date(Date.now() + 2592000), //unixTime: 1month
    signed: true,
  });

  res.json({ accessToken, expiresIn });
});

const signOut = catchAsync((req, res) => {
  const controller = switchAuthPlatform(req.params.platform);
  return controller.signOut(req, res);
});

module.exports = {
  hasPlatformToken,
  login,
  loginWithUserId,
  getOnlyPlatformToken,
  signOut,
};
