const axios = require("axios");
const qs = require("qs");
const { Base64 } = require("js-base64");

const { userService, tokenService } = require("../database");

exports.obtainOAuthCredentials = async (OAuth_params) => {
  const url = "https://accounts.spotify.com/authorize";
  const { scopes, redirect_uri } = OAuth_params;

  const params = {
    response_type: "code",
    client_id: process.env.SPOTIFY_ID,
    redirect_uri: redirect_uri,
    scope: scopes.join(" "),
  };

  const endpoint = await `${url}?${qs.stringify(params)}`;
  return endpoint;
};

exports.OAuthRedirect = async (code, OAuth_params) => {
  try {
    const { redirect_uri } = OAuth_params;

    const data = {
      code,
      grant_type: "authorization_code",
      redirect_uri: redirect_uri,
    };

    const key = Base64.encode(
      `${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`
    );

    const response = await axios({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        authorization: `Basic ${key}`,
      },
      data: qs.stringify(data),
    });

    console.log("response: ", response.data);

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

exports.getProfile = async (token) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://api.spotify.com/v1/me",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    // console.error(error);
    throw error;
  }
};

//에러처리: 리프레시 토큰이 만료된 경우
//
exports.updateRefreshToken = async (user_id) => {
  try {
    const token = await tokenService.findToken({
      user: user_id,
      provider: "spotify",
    });
    console.log("find refresh: ", token.refresh_token);

    const data = {
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
    };

    const key = Base64.encode(
      `${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`
    );

    const response = await axios({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        authorization: `Basic ${key}`,
      },
      data: qs.stringify(data),
    });

    await tokenService.updateToken({
      user: user_id,
      provider: "spotify",
      access_token: response.data.access_token,
      // refresh_token: response.data.refresh_token,
    });

    console.log(response.data);
    console.log("spotify new_access_token: ", response.data.access_token);
    // console.log("spotify new_refresh_token: ", response.data.refresh_token);

    return;
  } catch (error) {
    throw error;
  }
};

exports.signOut = async (user_id) => {
  try {
    Promise.all([
      tokenService.deleteToken(user_id),
      userService.destroyUser(user_id),
    ]);
    return;
  } catch (error) {
    throw error;
  }
};
