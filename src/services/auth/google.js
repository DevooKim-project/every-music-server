const axios = require("axios");

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
      data,
    });

    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

const refreshToken = async (token) => {
  try {
    const localToken = parseToken(req.headers.Authorization);
    const data = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = data.userId;

    const refreshToken = await tokenService.findRefreshToken(userId);

    const newToken = await axios({
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        client_id: process.env.GOOGLE_ID,
        client_secret: process.env.GOOGLE_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      },
    });

    await tokenService.updateToken({
      userId,
      accessToken: newToken.accessToken,
    });
    return;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { getToken, refreshToken };
