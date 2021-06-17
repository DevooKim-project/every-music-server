const httpStatus = require("http-status");
const redis = require("redis");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config/config");
const { tokenTypes } = require("../config/type");
const logger = require("../config/logger");

const client = redis.createClient(config.redis.url);
const getAsync = promisify(client.get).bind(client);

client.on("error", (error) => {
  logger.error(error);
});

const generateToken = (tokenBody, expires, secret = config.jwt.secret) => {
  const payload = {
    iss: "everyMusic.com",
    ...tokenBody,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

const generateLocalToken = async (user) => {
  const tokenBody = {
    id: user.id,
    name: user.nick,
    image: user.image,
    platform: user.platform,
    platformId: user.platformId,
  };
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, "minutes");
  const accessToken = generateToken(tokenBody, accessTokenExpires);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, "days");
  const refreshToken = generateToken({ id: tokenBody.id }, refreshTokenExpires);

  return { accessToken, refreshToken, expiresIn: accessTokenExpires.unix() };
};

const setKeys = (userId, platform) => {
  const keys = {};
  keys[tokenTypes.ACCESS] = `${userId}-${platform}-${tokenTypes.ACCESS}`;
  keys[tokenTypes.REFRESH] = `${userId}-${platform}-${tokenTypes.REFRESH}`;
  return keys;
};

const setPlatformToken = async (userId, platform, token) => {
  const keys = setKeys(userId, platform);
  if (token.hasOwnProperty("refreshToken") && token.refreshToken) {
    client.set(keys[tokenTypes.REFRESH], token.refreshToken);
    client.expire(keys[tokenTypes.REFRESH], (token.refreshTokenExpiresIn || 5184000) - 180); //60일
  }

  client.set(keys[tokenTypes.ACCESS], token.accessToken);
  client.expire(keys[tokenTypes.ACCESS], (token.expiresIn || 3600) - 180);
  return;
};

const getPlatformTokenByUserId = async (userId, platform) => {
  const keys = setKeys(userId, platform);
  const tokens = {
    accessToken: await getAsync(keys[tokenTypes.ACCESS]),
    refreshToken: await getAsync(keys[tokenTypes.REFRESH]),
  };

  return tokens;
};

const deletePlatformTokenByUserId = async (userId, platform) => {
  const keys = setKeys(userId, platform);
  return await client.del([keys[tokenTypes.ACCESS], keys[tokenTypes.REFRESH]]);
};

module.exports = {
  generateToken,
  generateLocalToken,
  setKeys,
  setPlatformToken,
  getPlatformTokenByUserId,
  deletePlatformTokenByUserId,
};
