const Token = require("../../database/schema/token");

const storeToken = async (token) => {
  try {
    await Token.create({ token });
    return;
  } catch (error) {
    throw new Error(error);
  }
};

const findRefreshToken = async (userId) => {
  try {
    await Token.findOne({ userId }).populate("refreshToken");
    return;
  } catch (error) {
    throw new Error(error);
  }
};

const updateToken = async ({ userId, accessToken }) => {
  try {
    await Token.updateOne({ userId }, { accessToken });
    return;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { findRefreshToken, updateToken };
