const Token = require("../../database/schema/token");
const storeToken = async (data) => {
  try {
    await Token.create(data);
  } catch (error) {
    throw error;
  }
};

const updateToken = async (data) => {
  try {
    const { user, provider, accessToken, refreshToken } = data;

    if (!refreshToken) {
      await Token.updateOne(
        { user: user, provider: provider },
        { tokens: { accessToken: accessToken, refreshToken: refreshToken } }
      );
    } else {
      await Token.updateOne(
        { user: user, provider: provider },
        { tokens: { accessToken: accessToken } }
      );
    }
  } catch (error) {
    throw error;
  }
};

const findToken = async (data) => {
  try {
    const token = await Token.findOne(data);
    console.log(token);
    return token;
  } catch (error) {
    throw error;
  }
};

const deleteToken = async (userId) => {
  try {
    await Token.deleteMany({ user: userId });
    return;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { storeToken, findToken, updateToken, deleteToken };
