const axios = require("axios");
const qs = require("qs");
const jwt = require("jsonwebtoken");

const { base64Encode } = require("../../middleware/auth");
const { tokenService } = require("../database");
const { parseToken } = require("../../middleware/auth");

const getToken = async (code) => {
  try {
    const data = {
      code,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:5000/auth/spotify/callback",
    };

    const key = base64Encode(
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

const getProfile = async (token) => {
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
    throw new Error("getProfile Error: ", error);
  }
};

const refreshToken = async (token) => {
  try {
    const localToken = parseToken(token);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.id;
    const refreshToken = await tokenService.findRefreshToken(userId, "spotify");
    console.log("find refresh: ", refreshToken);

    const data = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };

    const key = base64Encode(
      `${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`
    );

    const newToken = await axios({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        authorization: `Basic ${key}`,
      },
      data: qs.stringify(data),
    });

    await tokenService.updateToken(
      {
        userId,
        accessToken: newToken.data.access_token,
      },
      "spotify"
    );

    return;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = { getToken, getProfile, refreshToken };