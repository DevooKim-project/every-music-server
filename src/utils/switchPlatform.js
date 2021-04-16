const { platformTypes } = require("../config/type");
const {
  authGoogleController,
  authSpotifyController,
  authKakaoController,
} = require("../router/auth/platform");
const {
  convertYoutubeController,
  convertSpotifyController,
} = require("../router/convert/platform");

const switchAuthPlatform = (platform) => {
  if (platform === platformTypes.GOOGLE) {
    return authGoogleController;
  }
  if (platform === platformTypes.SPOTIFY) {
    return authSpotifyController;
  }
  if (platform === platformTypes.KAKAO) {
    return authKakaoController;
  }
};

const switchConvertPlatform = (platform) => {
  if (platform === platformTypes.YOUTUBE) {
    return convertYoutubeController;
  }

  if (platform === platformTypes.SPOTIFY) {
    return convertSpotifyController;
  }
};

module.exports = { switchAuthPlatform, switchConvertPlatform };
