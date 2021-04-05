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
    console.log(error);
    throw error;
    if (error.code === 110000) {
      //유저에서 이메일로 먼저 가입된 서비스명 제공
      throw new Error({ code: "AlreadyExistUser", message });
    }
  }
};

const destroyUser = async (userId) => {
  try {
    Promise.all([
      Playlist.deleteMany({ owner: userId }),
      User.deleteOne({ _id: userId }),
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports = { createUser, findOneUser, destroyUser };
