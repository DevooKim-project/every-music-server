const Playlist = require("../../database/schema/playlist");
// const { playlist } = require("../playlist/youtube");

const storePlaylist = async (data, tracks, ownerId) => {
  try {
    // const { title, id, description, thumbnail } = data;
    const { id } = data;
    await Playlist.create({
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
    // const playlist = await Playlist.find({ owner: id });
    // return playlist;
  } catch (error) {
    throw error;
  }
};

const findAllPlaylist = async (limit, last_id) => {
  try {
    if (!last_id) {
      //page1
      const playlist = await Playlist.find().sort({ like: 1 }).limit(limit);
      return playlist;
    } else {
      //page2...
      const playlist = await Playlist.find({ _id: { $gt: last_id } }).limit(
        limit
      );
      return playlist;
    }
  } catch (error) {
    throw error;
  }
};

const findUserPlaylist = async (limit, last_id, owner) => {
  try {
    if (!last_id) {
      //page1
      const playlist = await Playlist.find({ owner: owner })
        .sort({ like: 1 })
        .limit(limit);
      return playlist;
    } else {
      //page2...
      const playlist = await Playlist.find({
        _id: { $gt: last_id },
        owner: owner,
      }).limit(limit);
      return playlist;
    }
  } catch (error) {
    throw error;
  }
};

const findUserLikePlaylist = async (limit, last_id, owner) => {
  try {
    if (!last_id) {
      //page1
      const playlist = await Playlist.find({ owner: owner })
        .sort({ like: 1 })
        .limit(limit);
      return playlist;
    } else {
      //page2...
      const playlist = await Playlist.find({
        _id: { $gt: last_id },
        owner: owner,
      }).limit(limit);
      return playlist;
    }
  } catch (error) {
    throw error;
  }
};

const likePlaylist = async (playlistId, status) => {
  try {
    switch (status) {
      case "up":
        await Playlist.updateOne({ _id: playlistId }, { $inc: { like: 1 } });
        return;
      case "down":
        await Playlist.updateOne({ _id: playlistId }, { $inc: { like: -1 } });
        return;
      default:
        throw new Error("likePlaylist type error");
    }
  } catch (error) {
    throw error;
  }
};

const deletePlaylist = async (playlistId, owner) => {
  try {
    await Playlist.deleteOne({ _id: playlistId, owner: owner });
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  storePlaylist,
  findOnePlaylist,
  findAllPlaylist,
  findUserPlaylist,
  likePlaylist,
  deletePlaylist,
};
