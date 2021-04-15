const httpStatus = require("http-status");

const { platformTypes, authTypes } = require("../../config/type");
const catchAsync = require("../../utils/catchAsync");
const spotifyController = require("./spotifyController");
const googleController = require("./googleController");
const ApiError = require("../../utils/ApiError");

const obtainOAuth = catchAsync(async (req, res) => {
  const type = req.params.type;
  if (type === platformTypes.GOOGLE) {
    return googleController.obtainOAuth(authTypes.LOGIN)(req, res);
  }

  if (type === platformTypes.SPOTIFY) {
    return spotifyController.obtainOAuth(authTypes.LOGIN)(req, res);
  }

  if (type === platformTypes.KAKAO) {
  }

  throw ApiError(httpStatus.NOT_FOUND, "Not found");
});

const login = catchAsync(async (req, res) => {
  const type = req.params.type;
  if (type === platformTypes.GOOGLE) {
    return googleController.login(authTypes.LOGIN)(req, res);
  }

  if (type === platformTypes.SPOTIFY) {
    return spotifyController.login(authTypes.LOGIN)(req, res);
  }

  if (type === platformTypes.KAKAO) {
  }
});

// const type = req.params.type
// if(type === platformTypes.GOOGLE) {}

// if (type === platformTypes.SPOTIFY) {}

// if(type === platformTypes.KAKAO){}

module.exports = { obtainOAuth, login };
