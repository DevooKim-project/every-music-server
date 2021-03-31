const PlayList = require("../../database/schema/playlist");

const storePlayList = async (data, tracks, ownerId) => {
  try {
    // const { title, id, description, thumbnail } = data;
    const { id } = data;
    await PlayList.create({
      ...data,
      providerId: id,
      owner: ownerId,
      tracks,
    });
    return;
    // switch (provider) {
    //   case "youtube":
    //     await PlayList.create({
    //       title,
    //       providerId: { youtube: id },
    //       description,
    //       tracks,
    //       thumbnail,
    //       owner,
    //     });
    //     return;

    //   case "spotify":
    //     await PlayList.create({
    //       title,
    //       providerId: { spotify: id },
    //       description,
    //       tracks,
    //       thumbnail,
    //       owner,
    //     });
    //     return;

    //   default:
    //     throw new Error("storePlayList type error");
    // }
  } catch (error) {
    throw error;
  }
};

//find 종류
//1. 오너Id로 검색
//2. findOne 아님
const findPlayList = async (id) => {
  try {
    const playList = await PlayList.findOne({ id });
    return playList;
  } catch (error) {
    throw error;
  }
};

module.exports = { storePlayList, findPlayList };
