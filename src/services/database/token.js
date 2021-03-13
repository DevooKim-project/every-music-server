const Token = require("../../database/schema/token");

const storeToken = async (token) => {
  try {
    await Token.create({ ...token });
    return;
  } catch (error) {
    throw new Error(error);
  }
};

const findRefreshToken = async (userId) => {
  try {
    const token = await Token.findOne({ userId });
    return token.refreshToken;
  } catch (error) {
    throw new Error(error);
  }
};

const updateToken = async (data) => {
  try {
    const { userId, accessToken, refreshToken } = data;

    if (refreshToken) {
      await Token.updateOne({ userId }, { accessToken, refreshToken });
    } else {
      await Token.updateOne({ userId }, { accessToken });
    }

    return;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteToken = async (userId) => {
  try {
    await Token.deleteOne({ ...userId });
    return;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { storeToken, findRefreshToken, updateToken, deleteToken };
