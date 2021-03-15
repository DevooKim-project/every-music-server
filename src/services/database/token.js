const Token = require("../../database/schema/token");

const storeToken = async (data, type) => {
  try {
    const { userId, accessToken, refreshToken } = data;
    switch (type) {
      case "google":
        await Token.create({
          userId,
          accessTokenGoogle: accessToken,
          refreshTokenGoogle: refreshToken,
        });
        return;

      case "spotify":
        await Token.create({
          userId,
          accessTokenSpotify: accessToken,
          refreshTokenSpotify: refreshToken,
        });
        return;

      default:
        throw new Error("token type error");
    }
  } catch (error) {
    throw new Error(error);
  }
};

const findRefreshToken = async (userId, type) => {
  try {
    const token = await Token.findOne({ userId });

    switch (type) {
      case "google":
        return token.refreshTokenGoogle;
      case "spotify":
        return token.refreshTokenSpotify;

      default:
        throw new Error("token type error");
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateToken = async (data, type) => {
  try {
    const { userId, accessToken, refreshToken } = data;

    switch (type) {
      case "google":
        if (refreshToken) {
          await Token.updateOne(
            { userId },
            { accessTokenGoogle: accessToken, refreshTokenGoogle: refreshToken }
          );
        } else {
          await Token.updateOne({ userId }, { accessTokenGoogle: accessToken });
        }
        break;
      case "spotify":
        if (refreshToken) {
          await Token.updateOne(
            { userId },
            {
              accessTokenSpotify: accessToken,
              refreshTokenSpotify: refreshToken,
            }
          );
        } else {
          await Token.updateOne(
            { userId },
            { accessTokenSpotify: accessToken }
          );
        }
        break;

      default:
        throw new Error("token type error");
    }

    return;
  } catch (error) {
    console.error(error);
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
