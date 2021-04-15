const { authTypes } = require("./type");
const googleParam = (type) => {
  if (type === authTypes.LOGIN) {
    return {
      scopes: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.force-ssl",
        "https://www.googleapis.com/auth/youtube",
      ],
      redirectUri: `http://localhost:5000/auth/google/${type}/callback`,
    };
  }

  if (type === authTypes.TOKEN) {
    return {
      scopes: [
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.force-ssl",
        "https://www.googleapis.com/auth/youtube",
      ],
      redirectUri: `http://localhost:5000/auth/google/${type}/callback`,
    };
  }
};

const spotifyParam = (type) => {
  if (type === authTypes.LOGIN) {
    return {
      scopes: [
        "user-read-email",
        "playlist-modify-public",
        "playlist-modify-private",
        "playlist-read-private",
      ],
      redirectUri: `http://localhost:5000/auth/spotify/${type}/callback`,
    };
  }

  if (type === authTypes.TOKEN) {
    return {
      scopes: [
        "playlist-modify-public",
        "playlist-modify-private",
        "playlist-read-private",
      ],
      redirectUri: `http://localhost:5000/auth/spotify/${type}/callback`,
    };
  }
};

module.exports = { googleParam, spotifyParam };
