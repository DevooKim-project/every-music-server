const axios = require("axios");
const qs = require("qs");

const { platformTypes } = require("../config/type");
const { kakaoParams } = require("../config/oAuthParam");
const tokenService = require("./tokenService");

const getOAuthUrl = (type) => {
  const oAuthParam = kakaoParams(type);
  const { scopes, redirectUri } = oAuthParam;
  const url = "https://kauth.kakao.com/oauth/authorize";

  const params = {
    clientid: process.env.KAKAOid,
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
    clientid: process.env.KAKAOid,
    client_secret: process.env.KAKAO_SECRET,
    redirect_uri: redirectUri,
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

// exports.obtainAdditionalPermissions = async (scope, redirect_uri) => {
//   const url = "https://kauth.kakao.com/oauth/authorize";
//   const params = {
//     clientid: process.env.KAKAOid,
//     redirect_uri: "http://localhost:5000/auth/kakao/callback",
//     response_type: "code",
//     scope: scope.join(","),
//     // state: "", //CSRF 공격 보호를 위한 임의의 문자열
//   };

//   const endpoint = await `${url}?${qs.stringify(params)}`;
//   return endpoint;
// };

const getProfile = async (accessToken) => {
  const profile = await axios({
    method: "POST",
    url: "https://kapi.kakao.com/v2/user/me",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  return profile.data;
};

const signOut = async (platformId) => {
  const params = {
    targetid_type: "userid",
    targetid: platformId,
  };
  const options = {
    method: "POST",
    url: "https://kapi.kakao.com/v1/user/unlink",
    headers: {
      Authorization: `KakaoAK ${process.env.KAKAO_ADMIN}`,
    },
    params,
  };

  await axios(options);
  return;
};

module.exports = {
  getOAuthUrl,
  getPlatformToken,
  getProfile,
  signOut,
};