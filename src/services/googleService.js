const axios = require("axios");
const qs = require("qs");
const jwt = require("jsonwebtoken");

const { platformTypes } = require("../config/type");
const { googleParams } = require("../config/oAuthParam");
const tokenService = require("./tokenService");

const getOAuthUrl = (type) => {
  const oAuthParam = googleParams(type);
  const { scopes, redirectUri } = oAuthParam;
  const url = "https://accounts.google.com/o/oauth2/v2/auth";

  const params = {
    clientid: process.env.GOOGLEid,
    redirect_uri: redirectUri,
    response_type: "code",
    // access_type: "offline",
    scope: scopes.join(" "),
  };

  const oAuthUri = `${url}?${qs.stringify(params)}`;
  return oAuthUri;
};

const getPlatformToken = async (code, type) => {
  const oAuthParam = googleParams(type);
  const { redirectUri } = oAuthParam;
  const data = {
    code,
    clientid: process.env.GOOGLEid,
    client_secret: process.env.GOOGLE_SECRET,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  const response = await axios({
    method: "POST",
    url: "https://oauth2.googleapis.com/token",
    data: qs.stringify(data),
  });

  console.log(response.data);
  return response.data;
};

const getProfile = (idToken) => {
  return jwt.decode(idToken);
};

const revoke = async (userId) => {
  const token = await tokenService.findPlatformTokenById(
    userId,
    platformTypes.GOOGLE
  );

  const params = { token: token.refreshToken };
  const options = {
    method: "POST",
    url: "https://oauth2.googleapis.com/revoke",
    params,
  };

  await axios(options);
};

module.exports = {
  getOAuthUrl,
  getPlatformToken,
  getProfile,
  revoke,
};
