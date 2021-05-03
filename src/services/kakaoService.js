const axios = require("axios");
const qs = require("qs");

const { kakaoParams } = require("../config/oAuthParam");

const getOAuthUrl = (type) => {
  const oAuthParam = kakaoParams(type);
  const { scopes, redirectUri } = oAuthParam;
  const url = "https://kauth.kakao.com/oauth/authorize";

  const params = {
    client_id: process.env.KAKAO_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(","),
    // state: "", //CSRF 공격 보호를 위한 임의의 문자열
  };

  const oAuthUri = `${url}?${qs.stringify(params)}`;

  return oAuthUri;
};

const getPlatformToken = async (code, type) => {
  const oAuthParam = kakaoParams(type);
  const { redirectUri } = oAuthParam;

  const data = {
    code,
    client_id: process.env.KAKAO_ID,
    client_secret: process.env.KAKAO_SECRET,
    redirect_uri: "http://localhost:3000/?platform=kakao",
    grant_type: "authorization_code",
  };

  const response = await axios({
    method: "POST",
    url: "https://kauth.kakao.com/oauth/token",
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

const signOut = (platformId) => {
  const params = {
    target_id_type: "user_id",
    target_id: platformId,
  };
  const options = {
    method: "POST",
    url: "https://kapi.kakao.com/v1/user/unlink",
    headers: {
      Authorization: `KakaoAK ${process.env.KAKAO_ADMIN}`,
    },
    params,
  };

  return axios(options);
};

module.exports = {
  getOAuthUrl,
  getPlatformToken,
  getProfile,
  signOut,
};
