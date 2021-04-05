const Playlist = require("../../database/schema/playlist");
const User = require("../../database/schema/user");
// const { playlist } = require("../playlist/youtube");

const storePlaylist = async (data, tracks, ownerId) => {
  try {
    // const { title, id, description, thumbnail } = data;
    const { id } = data;
    await Playlist.create({
      ...data,
      provider_id: id,
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

const findAllPlaylist = async (limit, lastId) => {
  try {
    if (!lastId) {
      //page1
      const playlist = await Playlist.find({ display: true })
        .sort({ like: 1 })
        .limit(limit);
      return playlist;
    } else {
      //page2...
      const playlist = await Playlist.find({
        _id: { $gt: lastId },
        display: true,
      })
        .sort({ like: 1 })
        .limit(limit);
      return playlist;
    }
  } catch (error) {
    throw error;
  }
};

const findUserPlaylist = async (limit, lastId, data) => {
  try {
    let privateQuery = {};
    if (data.isMine) {
      privateQuery = { $or: [{ private: true }, { private: false }] };
    } else {
      privateQuery = { private: true };
    }

    if (!lastId) {
      //page1
      const playlist = await Playlist.find({
        owner: owner,
        ...privateQuery,
      }).limit(limit);
      return playlist;
    } else {
      //page2...
      const playlist = await Playlist.find({
        _id: { $gt: lastId },
        owner: owner,
        ...privateQuery,
      }).limit(limit);
      return playlist;
    }
  } catch (error) {
    throw error;
  }
};

const findUserLibrary = async (data) => {
  try {
    const userData = await User.findOne({ _id: data.owner }).populate(
      "like_playlistss"
    );
    const library = userData.like_playlistss;
    return library;
  } catch (error) {
    throw error;
  }
};

const likePlaylist = async (playlistId, user, status) => {
  try {
    switch (status) {
      case "up":
        await User.updateOne({ _id: user }, { $addToSet: { t: playlistId } });
        await Playlist.updateOne({ _id: playlistId }, { $inc: { like: 1 } });
        return;
      case "down":
        await User.updateOne({ _id: user }, { $pullAll: { t: [playlistId] } });
        await Playlist.updateOne({ _id: playlistId }, { $inc: { like: -1 } });
        return;
      default:
        throw new Error("likePlaylist type error");
    }
  } catch (error) {
    throw error;
  }
};

const changePrivatePlaylist = async (playlistId, data, owner) => {
  try {
    await Playlist.updateOne(
      { _id: playlistId, owner: owner },
      { private: data.private }
    );
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
  findUserLibrary,
  likePlaylist,
  changePrivatePlaylist,
  deletePlaylist,
};
