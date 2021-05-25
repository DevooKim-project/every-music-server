const axios = require("axios");
const qs = require("qs");
const config = require("../config/config");
const { kakaoParams } = require("../config/oAuthParam");

const getOAuthUrl = (type) => {
  const oAuthParam = kakaoParams(type);
  const { scopes, redirectUri } = oAuthParam;
  const url = "https://kauth.kakao.com/token/authorize";

  const params = {
    client_id: config.token.kakaoId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(","),
    // state: "", //CSRF 공격 보호를 위한 임의의 문자열
  };

  const oAuthUri = `${url}?${qs.stringify(params)}`;

  return oAuthUri;
};

const getPlatformToken = async ({ code, type }) => {
  const redirectUri = type === "login" ? process.env.REDIRECT_LOGIN : process.env.REDIRECT_TOKEN;
  const data = {
    code,
    client_id: config.token.kakaoId,
    client_secret: config.token.kakaoSecret,
    redirect_uri: `${redirectUri}/?platform=kakao&type=${type}`,
    grant_type: "authorization_code",
  };

  const response = await axios({
    method: "POST",
    url: "https://kauth.kakao.com/token/token",
    data: qs.stringify(data),
  });

  console.log(response.data);
  return response.data;
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
    url: "https://kauth.kakao.com/token/token",
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
  getOAuthUrl,
  getPlatformToken,
  getProfile,
  refreshAccessToken,
  signOut,
};
