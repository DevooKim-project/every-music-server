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
    throw new Error(error);
  }
};

const refreshToken = async (token) => {
  try {
    const localToken = parseToken(token);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.id;
    const refreshToken = await tokenService.findRefreshToken({
      userId,
      type: "google",
    });
    console.log("find refresh: ", refreshToken);

    const data = {
      client_id: process.env.GOOGLE_ID,
      client_secret: process.env.GOOGLE_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    };

    const newToken = await axios({
      method: "POST",

      url: "https://oauth2.googleapis.com/token",
      data: qs.stringify(data),
    });

    console.log(newToken);

    await tokenService.updateToken(
      {
        userId,
        accessToken: newToken.accessToken,
      },
      "google"
    );
    return;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = { getToken, refreshToken };
