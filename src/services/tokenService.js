const jwt = require("jsonwebtoken");
const moment = require("moment");

const { tokenTypes } = require("../config/type");
const { Token } = require("../database/schema");
const ApiError = require("../utils/ApiError");

const generateToken = (tokenBody, expires, secret = process.env.JWT_SECRET) => {
  const payload = {
    iss: "everyMusic.com",
    ...tokenBody,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

const hasToken = (req, type, required = true) => {
  if (type === tokenTypes.ACCESS && req.headers.authorization) {
    return type;
  }
  if (type === tokenTypes.REFRESH && req.cookies.hasOwnProperty("refreshToken")) {
    return type;
  }

  if (required) {
    return;
  }
  throw new ApiError(httpStatus.UNAUTHORIZED, `Not found ${type}`);
};

const upsertPlatformToken = async (userId, platform, token) => {
  if (token.hasOwnProperty("refreshToken")) {
    await Token.updateOne(
      { user: userId, platform },
      {
        $set: {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        },
      },
      { upsert: true }
    );
  } else {
    await Token.updateOne({ user: userId, platform }, { $set: { accessToken: token.accessToken } }, { upsert: true });
  }
  return;
};

const generateLocalToken = (user) => {
  const tokenBody = {
    id: user.id,
    name: user.nick,
    platform: user.platform,
    platformId: user.platformId,
  };
  const accessTokenExpires = moment().add(process.env.accessExpirationMinutes, "minutes");
  const accessToken = generateToken(tokenBody, accessTokenExpires);

  const refreshTokenExpires = moment().add(process.env.refreshExpirationMinutes, "days");
  const refreshToken = generateToken({ id: tokenBody.id }, refreshTokenExpires);

  return { accessToken, refreshToken };
};

const findPlatformTokenByUserId = async (userId, platform) => {
  const token = await Token.findOne({ user: userId, platform });
  console.log(token);
  return token;
};

const deletePlatformTokenByUserId = async (userId) => {
  return await Token.deleteMany({ user: userId });
};

module.exports = {
  generateToken,
  hasToken,
  upsertPlatformToken,
  generateLocalToken,
  findPlatformTokenByUserId,
  deletePlatformTokenByUserId,
};
