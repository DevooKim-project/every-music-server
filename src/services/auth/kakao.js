const axios = require("axios");
const qs = require("qs");

const getToken = async (code) => {
  try {
    const data = {
      code,
      client_id: process.env.KAKAO_ID,
      client_secret: process.env.KAKAO_SECRET,
      redirect_uri: "http://localhost:5000/auth/kakao/callback",
      grant_type: "authorization_code",
    };

    const response = await axios({
      method: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      data: qs.stringify(data),
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const getProfile = async (token) => {
  try {
    const profile = await axios({
      method: "POST",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    return profile.data;
  } catch (error) {
    throw new Error(error);
  }
};

// const logout = async();

module.exports = { getToken, getProfile };
