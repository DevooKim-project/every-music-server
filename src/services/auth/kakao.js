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

    console.log("tokens: ", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = { getToken };
