const httpStatus = require("http-status");

const { platformTypes, authTypes } = require("../../config/type");
const catchAsync = require("../../utils/catchAsync");
const { googleController, spotifyController } = require("./platform");
const ApiError = require("../../utils/ApiError");
const { userService, tokenService } = require("../../services");

const obtainOAuth = catchAsync(async (req, res) => {
  const platform = req.params.platform;
  if (platform === platformTypes.GOOGLE) {
    return googleController.obtainOAuth(authTypes.LOGIN)(req, res);
  }

  if (platform === platformTypes.SPOTIFY) {
    return spotifyController.obtainOAuth(authTypes.LOGIN)(req, res);
  }

  if (platform === platformTypes.KAKAO) {
  }

  throw ApiError(httpStatus.NOT_FOUND, "Not found");
});

const login = catchAsync(async (req, res) => {
  const platform = req.params.platform;
  if (platform === platformTypes.GOOGLE) {
    return googleController.login(authTypes.LOGIN)(req, res);
  }

  if (platform === platformTypes.SPOTIFY) {
    return spotifyController.login(authTypes.LOGIN)(req, res);
  }

  if (platform === platformTypes.KAKAO) {
  }
});

const getOnlyPlatformToken = catchAsync(async (req, res) => {
  const platform = req.params.platform;
  if (platform === platformTypes.GOOGLE) {
    return googleController.getOnlyToken(authTypes.Token)(req, res);
  }

  if (platform === platformTypes.SPOTIFY) {
    return spotifyController.getOnlyToken(authTypes.Token)(req, res);
  }
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

const signOut = catchAsync(async (req, res) => {
  const platform = req.params.platform;
  if (platform === platformTypes.GOOGLE) {
    return googleController.signOut(authTypes.LOGIN)(req, res);
  }

  if (platform === platformTypes.SPOTIFY) {
    return spotifyController.signOut(authTypes.LOGIN)(req, res);
  }

  if (platform === platformTypes.KAKAO) {
  }
});

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
