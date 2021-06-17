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

    return response.data;
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data.error;
      throw new ApiError(code, message);
    } else {
      throw new Error(error);
    }
  }
};

const getProfile = async (accessToken) => {
  try {
    const profile = await axios({
      method: "POST",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return profile.data;
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data.error;
      throw new ApiError(code, message);
    } else {
      throw new Error(error);
    }
  }
};

const refreshAccessToken = async (refreshToken) => {
  const data = {
    client_id: config.token.kakaoId,
    client_secret: config.token.kakaoSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };

  try {
    const response = await axios({
      method: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      data: qs.stringify(data),
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data.error;
      throw new ApiError(code, message);
    } else {
      throw new Error(error);
    }
  }
};

const signOut = (platformId) => {
  const params = {
    target_id_type: "user_id",
    target_id: platformId,
  };
  try {
    const options = {
      method: "POST",
      url: "https://kapi.kakao.com/v1/user/unlink",
      headers: {
        Authorization: `KakaoAK ${config.token.kakaoAdmin}`,
      },
      params,
    };
    return axios(options);
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data.error;
      throw new ApiError(code, message);
    } else {
      throw new Error(error);
    }
  }
};

module.exports = {
  getPlatformToken,
  getProfile,
  refreshAccessToken,
  signOut,
};
