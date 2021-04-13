const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { User } = require("../database/schema");

const tokenService = require("./tokenService");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const user = await User.create(userBody);
  return user;
};

const deleteUserWithTokenAndPlaylistById = async (userId) => {
  const user = getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  Promise.all([
    playlistService.deletePlaylistByUserId(userId),
    tokenService.deletePlatformTokenByUserId(userId),
    user.remove(),
  ]);
  // await user.remove();
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

module.exports = {
  createUser,
  deleteUserWithTokenAndPlaylistById,
  getUserById,
  getUserByEmail,
};
