const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { User } = require("../database/schema");

const tokenService = require("./tokenService");
const playlistService = require("./playlistService");

const createUser = async (userBody) => {
  const user = await User.create(userBody);
  return user;
};

const login = async (userBody, platform, platformToken) => {
  const user = await User.findOneAndUpdate(
    { email: userBody.email, platform: platform },
    { $set: { ...userBody } },
    { upsert: true, new: true }
  );
  const localToken = tokenService.generateLocalToken(user);
  await tokenService.setPlatformToken(user.id, platform, platformToken);

  return localToken;
};

const deleteUserWithTokenAndPlaylistById = async (userId) => {
  return Promise.all([
    playlistService.deletePlaylistByUserId(userId),
    tokenService.deletePlatformTokenByUserId(userId),
    deleteUserById(userId),
  ]);
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmailAndPlatform = async (email, platform) => {
  return User.findOne({ email, platform });
};

const deleteUserById = async (id) => {
  const user = await User.deleteOne({ _id: id });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found User");
  }
};

module.exports = {
  createUser,
  login,
  deleteUserWithTokenAndPlaylistById,
  getUserById,
  getUserByEmailAndPlatform,
  deleteUserById,
};
