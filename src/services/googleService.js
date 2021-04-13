const axios = require("axios");
const { platformTypes } = require("../config/type");
const { Token } = require("../database/schema");
const ApiError = require("../utils/ApiError");
const tokenService = require("./tokenService");
const userService = require("./userService");

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
  revoke,
};
