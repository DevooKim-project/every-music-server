const User = require("../../database/schema/user");
const Playlist = require("../../database/schema/playlist");

exports.createUser = async (data) => {
  try {
    const user = await User.create(data);
    return user;
  } catch (error) {
    throw error;
  }
};

exports.findOneUser = async (data) => {
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

exports.destroyUser = async (userid) => {
  try {
    Promise.all([
      Playlist.deleteMany({ owner: userid }),
      User.deleteOne({ id: userid }),
    ]);
  } catch (error) {
    throw error;
  }
};
