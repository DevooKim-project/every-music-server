const User = require("../../database/schema/user");
const Playlist = require("../../database/schema/playlist");

const createUser = async (data) => {
  try {
    const user = await User.create(data);
    return user;
  } catch (error) {
    throw error;
  }
};

const findOneUser = async (data) => {
  try {
    const user = await User.findOne(data);
    return user;
  } catch (error) {
    throw error;
  }
};

const destroyUser = async (userId) => {
  try {
    await Playlist.deleteMany({ owner: userId });
    User.deleteOne({ _id: userId });
  } catch (error) {
    throw error;
  }
};

module.exports = { createUser, findOneUser, destroyUser };
