const qs = require("qs");

const googleAuthorizationUrl = (redirectUri) => {
  const url = "https://accounts.google.com/o/oauth2/v2/auth";
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl",
    "https://www.googleapis.com/auth/youtube",
  ];

  const params = {
    client_id: process.env.GOOGLE_ID,
    redirect_uri: `${redirectUri}`,
    response_type: "code",
    access_type: "offline",
    scope: scopes.join(" "),
  };

  const oAuthUri = `${url}?${qs.stringify(params)}`;
  return oAuthUri;
};

const spotifyAuthorizationUrl = (redirectUri) => {
  const url = "https://accounts.spotify.com/authorize";

  const scopes = [
    "user-read-email",
    "playlist-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
  ];

  const params = {
    response_type: "code",
    client_id: process.env.SPOTIFY_ID,
    redirect_uri: `${redirectUri}`,
    scope: scopes.join(" "),
  };

  const oAuthUri = `${url}?${qs.stringify(params)}`;
  return oAuthUri;
};

const kakaoAuthorizationUrl = (redirectUri) => {
  const url = "https://kauth.kakao.com/oauth/authorize";

  const scopes = ["account_email", "profile"];

  const params = {
    client_id: process.env.KAKAO_ID,
    redirect_uri: `${redirectUri}`,
    response_type: "code",
    scope: scopes.join(","),
    // state: "", //CSRF 공격 보호를 위한 임의의 문자열
  };

  const oAuthUri = `${url}?${qs.stringify(params)}`;
  return oAuthUri;
};

module.exports = { googleAuthorizationUrl, spotifyAuthorizationUrl, kakaoAuthorizationUrl };
