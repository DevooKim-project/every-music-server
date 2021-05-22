const { authTypes } = require("../../config/type");
const catchAsync = require("../../utils/catchAsync");
const { switchAuthPlatform } = require("../../utils/switchPlatform");
const { userService, tokenService } = require("../../services");
const httpStatus = require("http-status");

const login = catchAsync((req, res) => {
  const controller = switchAuthPlatform(req.params.platform);
  return controller.login(req, res);
});

const loginWithUserId = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.payload.id);
  const { accessToken, refreshToken, expiresIn } = await tokenService.generateLocalToken(user);

  res.clearCookie("refreshToken");
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //JS에서 쿠키 접근 불가능
    // secure: true, //https에서만 쿠키 생성
    expires: new Date(Date.now() + 2592000), //unixTime: 1month
    signed: true,
  });

  res.json({ accessToken, expiresIn });
});

const signOut = catchAsync((req, res) => {
  const { platform } = req.payload;
  const controller = switchAuthPlatform(platform);
  return controller.signOut(req, res);
});

const generatePlatformToken = catchAsync((req, res) => {
  const controller = switchAuthPlatform(req.params.platform);
  return controller.generateToken(req, res);
});

const refreshPlatformToken = catchAsync((req, res) => {
  const controller = switchAuthPlatform(req.params.platform);
  return controller.refreshToken(req, res);
});

const getPlatformToken = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await tokenService.getPlatformTokenByUserId(
    req.payload.id,
    req.params.platform
  );
  res.send({ accessToken, refreshToken });
});

module.exports = {
  login,
  logout,
  loginWithUserId,
  signOut,
  generatePlatformToken,
  refreshPlatformToken,
  getPlatformToken,
};
