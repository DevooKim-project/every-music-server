const axios = require("axios");
const qs = require("qs");
const { Base64 } = require("js-base64");

const { spotifyParam } = require("../config/oAuthParam");
const tokenService = require("./tokenService");

const getOAuthUrl = async (type) => {
  const oAuthParam = spotifyParam(type);
  const { scopes, redirectUri } = oAuthParam;
  const url = "https://accounts.spotify.com/authorize";

  const params = {
    response_type: "code",
    client_id: process.env.SPOTIFY_ID,
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
  };

  const oAuthUri = await `${url}?${qs.stringify(params)}`;
  return oAuthUri;
};

const getPlatformToken = async (code, type) => {
  const oAuthParam = spotifyParam(type);
  const { redirectUri } = oAuthParam;

  const data = {
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
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
};

const getProfile = async (accessToken) => {
  const response = await axios({
    method: "GET",
    url: "https://api.spotify.com/v1/me",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(response.data);
  return response.data;
};

module.exports = {
  getOAuthUrl,
  getPlatformToken,
  getProfile,
};
