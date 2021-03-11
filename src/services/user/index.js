const User = require("../../models/user");

const createUser = async (data) => {
  try {
    const user = await User.create(data);
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneUser = async (param) => {
  try {
    const user = await User.findOne({
      where: { ...param },
    });

    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const destroyUser = async (param) => {
  try {
    await User.destroy({
      where: { ...param },
    });
    return;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { createUser, findOneUser, destroyUser };
