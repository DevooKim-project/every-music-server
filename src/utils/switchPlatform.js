const { platformTypes } = require("../config/type");
const {
  googleController,
  spotifyController,
  kakaoController,
} = require("../router/auth/platform");

const switchAuthPlatform = (platform) => {
  if (platform === platformTypes.GOOGLE) {
    return googleController;
  }
  if (platform === platformTypes.SPOTIFY) {
    return spotifyController;
  }
  if (platform === platformTypes.KAKAO) {
    return kakaoController;
  }
};

module.exports = {
  switchAuthPlatform,
};
