const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { User } = require("../database/schema");

const tokenService = require("./tokenService");

const createUser = async (userBody) => {
  const user = await User.create(userBody);
  return user;
};

const login = async (userBody, platform, platformToken) => {
  let user = await getUserByEmail(userBody.email);
  if (!user) {
    // register()
    user = await createUser(userBody);
  }
  if (user.platform !== platform) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Email already taken other platform"
    );
  }
  const localToken = tokenService.generateLocalToken(user);
  await tokenService.upsertPlatformToken(user.id, platform, platformToken);

  return localToken;
};

const deleteUserWithTokenAndPlaylistById = async (userId) => {
  Promise.all([
    // playlistService.deletePlaylistByUserId(userId),
    tokenService.deletePlatformTokenByUserId(userId),
    deleteUserById(userId),
  ]);
  return;
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const deleteUserById = async (id) => {
  await User.deleteOne({ _id: id });
};

module.exports = {
  createUser,
  login,
  deleteUserWithTokenAndPlaylistById,
  getUserById,
  getUserByEmail,
};
