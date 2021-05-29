const axios = require("axios");
const qs = require("qs");
const config = require("../config/config");

const getPlatformToken = async ({ code, redirectUri }) => {
  const data = {
    code,
    client_id: config.token.kakaoId,
    client_secret: config.token.kakaoSecret,
    redirect_uri: `${redirectUri}`,
    grant_type: "authorization_code",
  };
  try {
    const response = await axios({
      method: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      data: qs.stringify(data),
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (accessToken) => {
  const profile = await axios({
    method: "POST",
    url: "https://kapi.kakao.com/v2/user/me",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return profile.data;
};

const refreshAccessToken = async (refreshToken) => {
  const data = {
    client_id: config.token.kakaoId,
    client_secret: config.token.kakaoSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };

  const response = await axios({
    method: "POST",
    url: "https://kauth.kakao.com/oauth/token",
    data: qs.stringify(data),
  });
  return response.data;
};

const signOut = (platformId) => {
  const params = {
    target_id_type: "user_id",
    target_id: platformId,
  };
  const options = {
    method: "POST",
    url: "https://kapi.kakao.com/v1/user/unlink",
    headers: {
      Authorization: `KakaoAK ${config.token.kakaoAdmin}`,
    },
    params,
  };

  return axios(options);
};

module.exports = {
  getPlatformToken,
  getProfile,
  refreshAccessToken,
  signOut,
};
