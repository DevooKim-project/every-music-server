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
  let user = await getUserByEmail(userBody.email);
  if (!user) {
    user = await createUser(userBody);
  }
  if (user.platform !== platform) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken other platform");
  }
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

const getUserByEmail = async (email) => {
  return User.findOne({ email });
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
  getUserByEmail,
  deleteUserById,
};
