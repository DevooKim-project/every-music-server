const httpStatus = require("http-status");

const catchAsync = require("../../utils/catchAsync");
const { switchAuthPlatform } = require("../../utils/switchPlatform");
const { userService, tokenService } = require("../../services");
const { getAuthorizationUrl: getOAuthUrl } = require("../../utils/platformUtils");

const login = catchAsync((req, res) => {
  const controller = switchAuthPlatform(req.params.platform);
  return controller.login(req, res);
});

const logout = catchAsync((req, res) => {
  res.clearCookie("refreshToken");
  res.status(httpStatus.NO_CONTENT).send();
});

const loginWithUserId = catchAsync(async (req, res) => {
  if (!req.payload) {
    return res.status(httpStatus.NON_AUTHORITATIVE_INFORMATION).send();
  }
  const user = await userService.getUserById(req.payload.id);
  const { accessToken, refreshToken, expiresIn } = await tokenService.generateLocalToken(user);

  res.clearCookie("refreshToken");
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //JS에서 쿠키 접근 불가능
    secure: true, //https에서만 쿠키 생성
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

const getAuthorizationUrl = catchAsync(async (req, res) => {
  const authorizationUrl = getOAuthUrl(req.params.platform, req.query);
  res.send({ authorizationUrl });
});

module.exports = {
  login,
  logout,
  loginWithUserId,
  signOut,
  generatePlatformToken,
  refreshPlatformToken,
  getPlatformToken,
  getAuthorizationUrl,
};
