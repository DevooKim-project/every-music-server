const PlayList = require("../../database/schema/playlist");
const { playList } = require("../playlist/youtube");

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
  } catch (error) {
    throw error;
  }
};

//find 종류
//1. 오너Id로 검색
//2. findOne 아님
const findOnePlaylist = async (id) => {
  try {
    const playList = await PlayList.findOne({ id });
    return playList;
  } catch (error) {
    throw error;
  }
};

const findAllPlaylist = async (limit, last_id) => {
  try {
    if (!last_id) {
      //page1
      const playList = await PlayList.find().sort({ like: 1 }).limit(limit);
      return playList;
    } else {
      //page2...
      const playList = await PlayList.find({ _id: { $gt: last_id } }).limit(
        limit
      );
      return playList;
    }
  } catch (error) {
    throw error;
  }
};

const findUserPlaylist = async (limit, last_id, owner) => {
  try {
    if (!last_id) {
      //page1
      const playList = await PlayList.find({ owner: owner })
        .sort({ like: 1 })
        .limit(limit);
      return playList;
    } else {
      //page2...
      const playList = await PlayList.find({
        _id: { $gt: last_id },
        owner: owner,
      }).limit(limit);
      return playList;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  storePlayList,
  findOnePlaylist,
  findAllPlaylist,
  findUserPlaylist,
};
