const axios = require("axios");
const jwt = require("jsonwebtoken");
const qs = require("qs");

const { parseToken } = require("../../middleware/auth");
const { tokenService } = require("../database");

const getToken = async (code) => {
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
      // url: "https://accounts.gogle.com/o/oauth2/token",
      url: "https://oauth2.googleapis.com/token",
      data: qs.stringify(data),
    });

    console.log("Google: ", response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateRefreshToken = async (token) => {
  try {
    const localToken = parseToken(token);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.id;
    const token = await tokenService.findToken({
      user: userId,
      provider: "google",
    });
    console.log("find refresh: ", token.refreshToken);

    const data = {
      client_id: process.env.GOOGLE_ID,
      client_secret: process.env.GOOGLE_SECRET,
      refresh_token: token.refreshToken,
      grant_type: "refresh_token",
    };

    const newToken = await axios({
      method: "POST",

      url: "https://oauth2.googleapis.com/token",
      data: qs.stringify(data),
    });

    console.log("newToken: ", newToken.data);
    await tokenService.updateToken({
      user: userId,
      provider: "google",
      accessToken: newToken.data.access_token,
    });
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = { getToken, updateRefreshToken };
