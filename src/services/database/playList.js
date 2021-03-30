const PlayList = require("../../database/schema/playlist");

const storePlayList = async (data, provider) => {
  try {
    const { title, id, owner } = data;
    switch (provider) {
      case "youtube":
        await PlayList.create({
          title,
          provider: { youtube: id },
          owner,
        });
        return;

      case "spotify":
        await PlayList.create({
          title,
          provider: { spotify: id },
          owner,
        });
        return;

      default:
        throw new Error("storePlayList type error");
    }
  } catch (error) {
    throw error;
  }
};

const findPlayList = async (id) => {
  try {
    const playList = await PlayList.findOne({ id });
    return playList;
  } catch (error) {
    throw error;
  }
};

module.exports = { storePlayList, findPlayList };
