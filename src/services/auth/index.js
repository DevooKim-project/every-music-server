const googleService = require("./google");
const localService = require("./local");
const kakaoService = require("./kakao");
const spotifyService = require("./spotify");
const { userService } = require("../database");

exports.googleService = googleService;
exports.localService = localService;
exports.kakaoService = kakaoService;
exports.spotifyService = spotifyService;

exports.parseToken = (token) => {
  const newToken = token.replace(/^Bearer\s+/, "");
  return newToken;
};

exports.verifyUser = async (data) => {
  try {
    const user = await userService.findOneUser(data);
    return user;
  } catch (error) {
    throw error;
  }
};
