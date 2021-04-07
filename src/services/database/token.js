const Token = require("../../database/schema/token");
exports.storeToken = async (data) => {
  try {
    await Token.create(data);
  } catch (error) {
    throw error;
  }
};

exports.updateToken = async (data) => {
  try {
    const { user, provider, access_token, refresh_token } = data;

    if (refresh_token) {
      await Token.updateOne(
        { user: user, provider: provider },
        { access_token: access_token, refresh_token: refresh_token },
        { upsert: true }
      );
    } else {
      await Token.updateOne(
        { user: user, provider: provider },
        { access_token: access_token },
        { upsert: true }
      );
    }
    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.findToken = async (data) => {
  try {
    const token = await Token.findOne(data);
    console.log(token);
    return token;
  } catch (error) {
    throw error;
  }
};

exports.deleteToken = async (user_id) => {
  try {
    await Token.deleteMany({ user: user_id });
    return;
  } catch (error) {
    throw new Error(error);
  }
};
