const axios = require("axios");
const qs = require("qs");

const { tokenService, userService } = require("../database");

exports.obtainOAuthCredentials = async () => {
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
    redirect_uri: "http://localhost:5000/auth/google/callback",
    response_type: "code",
    access_type: "offline",
    scope: scopes.join(" "),
  };

  const endpoint = await `${url}?${qs.stringify(params)}`;
  return endpoint;
};

exports.OAuthRedirect = async (code) => {
  try {
    const data = {
      code,
      client_id: process.env.GOOGLE_ID,
      client_secret: process.env.GOOGLE_SECRET,
      redirect_uri: "http://localhost:5000/auth/google/callback",
      grant_type: "authorization_code",
    };

    const response = await axios({
      method: "POST",
      url: "https://oauth2.googleapis.com/token",
      data: qs.stringify(data),
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

//에러처리: 리프레시 토큰이 만료된 경우
//google은 만료 안됨
exports.updateRefreshToken = async (user_id) => {
  try {
    const token = await tokenService.findToken({
      user: user_id,
      provider: "google",
    });
    console.log("find refresh: ", token.refresh_token);

    const data = {
      client_id: process.env.GOOGLE_ID,
      client_secret: process.env.GOOGLE_SECRET,
      refresh_token: token.refresh_token,
      grant_type: "refresh_token",
    };

    const response = await axios({
      method: "POST",

      url: "https://oauth2.googleapis.com/token",
      data: qs.stringify(data),
    });

    await tokenService.updateToken({
      user: user_id,
      provider: "google",
      access_token: response.data.access_token,
    });
    console.log("google new_access_token: ", response.data.access_token);
    return;
  } catch (error) {
    throw error;
  }
};

exports.signOut = async (user_id) => {
  try {
    const token = await tokenService.findToken({
      user: user_id,
      provider: "google",
    });
    console.log("token: ", token);
    const params = {
      token: token.refresh_token,
    };
    const options = {
      method: "POST",
      url: "https://oauth2.googleapis.com/revoke",
      params,
    };

    Promise.all([
      axios(options),
      tokenService.deleteToken(user_id),
      userService.destroyUser(user_id),
    ]);
  } catch (error) {
    throw error;
  }
};
