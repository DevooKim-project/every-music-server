const Token = require("../../database/schema/token");

const storeToken = async (data, provider) => {
  try {
    const { userId, accessToken, refreshToken } = data;
    switch (provider) {
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
        throw new Error("storeToken type error");
    }
  } catch (error) {
    throw new Error(error);
  }
};

const findToken = async (userId, { type, provider }) => {
  try {
    const token = await Token.findOne({ userId });
    console.log(token);
    switch (provider) {
      case "google":
        if (type === "access") {
          return token.accessTokenGoogle;
        } else if (type === "refresh") {
          return token.refreshTokenGoogle;
        }

      case "spotify":
        if (type === "access") {
          return token.accessTokenSpotify;
        } else if (type === "refresh") {
          return token.refreshTokenSpotify;
        }

      default:
        throw new Error("findToken argument error");
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateToken = async (data, { type, provider }) => {
  try {
    const { userId, accessToken, refreshToken } = data;

    switch (provider) {
      case "google":
        if (type === "access") {
          await Token.updateOne({ userId }, { accessTokenGoogle: accessToken });
        } else if (type === "all") {
          await Token.updateOne(
            { userId },
            { accessTokenGoogle: accessToken, refreshTokenGoogle: refreshToken }
          );
        }
        break;
      case "spotify":
        if (type === "access") {
          await Token.updateOne(
            { userId },
            { accessTokenSpotify: accessToken }
          );
        } else if (type === "all") {
          await Token.updateOne(
            { userId },
            {
              accessTokenSpotify: accessToken,
              refreshTokenSpotify: refreshToken,
            }
          );
        }
        break;

      default:
        throw new Error("updateToken argument error");
    }
    return;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const deleteToken = async (userId) => {
  try {
    await Token.deleteOne({ userId });
    return;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { storeToken, findToken, updateToken, deleteToken };
