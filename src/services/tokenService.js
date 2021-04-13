const jwt = require("jsonwebtoken");
const moment = require("moment");

const { tokenTypes, platformTypes } = require("../config/type");
const { Token } = require("../database/schema");
const userService = require("./userService");
const ApiError = require("../utils/ApiError");

const generateToken = (tokenBody, expires, secret = process.env.JWT_SECRET) => {
  const payload = {
    iss: "everyMusic.com",
    ...tokenBody,
    iat: moment.unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

const hasToken = (req, type) => {
  if (type === tokenTypes.ACCESS && req.headers.authorization) {
    return type;
  }
  if (
    type === tokenTypes.REFRESH &&
    req.cookies.hasOwnProperty("refreshToken")
  ) {
    return type;
  }
  return;
};

const verifyToken = async (req, type) => {
  try {
    let token = "";
    if (type === tokenTypes.ACCESS) {
      token = req.headers.authorization;
    } else if (type === tokenTypes.REFRESH) {
      token = req.cookies.refreshToken;
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Not found token");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(419, "Expired token");
    }
  }
};

const refreshToken = async (userId, type) => {
  let token = "";
  if (type === platformTypes.GOOGLE) {
    token = await googleService.updateRefreshToken(userId);
  }
  if (type === platformTypes.SPOTIFY) {
    token = await spotifyService.updateRefreshToken(userId);
  }
  if (type === platformTypes.LOCAL) {
    const user = await userService.findUserById(userId);
    token = generateLocalToken(user);
  }
  return token;
};

const updateLocalToken = async (userId, platForm, token) => {
  if (token.hasOwnProperty("refreshToken")) {
    await Token.updateOne(
      { user: userId, platForm },
      {
        $set: {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        },
      },
      { upsert: true }
    );
  } else {
    await Token.updateOne(
      { user: userId, platForm },
      { $set: { accessToken: token.accessToken } },
      { upsert: true }
    );
  }
};

const generateLocalToken = async (user) => {
  const accessTokenExpires = moment().add(
    process.env.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = await generateToken(user, accessTokenExpires);

  const refreshTokenExpires = moment().add(
    process.env.refreshExpirationMinutes,
    "days"
  );
  const refreshToken = await generateToken(user.id, refreshTokenExpires);

  console.log("local access_token: ", accessToken);
  console.log("local refresh_token: ", refreshToken);

  return { accessToken, refreshToken };
};

const savePlatformToken = async (tokenBody) => {
  await Token.create(tokenBody);
  return;
};

const findPlatformTokenById = async (userId, platform) => {
  const token = await Token.findOne({ user: userId, platform });
  return token;
};

module.exports = {
  generateToken,
  hasToken,
  verifyToken,
  refreshToken,
  updateLocalToken,
  generateLocalToken,
  savePlatformToken,
  findPlatformTokenById,
};
