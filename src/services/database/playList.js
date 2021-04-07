const Playlist = require("../../database/schema/playlist");
const User = require("../../database/schema/user");
// const { playlist } = require("../playlist/youtube");

exports.storePlaylist = async (data, tracks, owner) => {
  try {
    // const { title, id, description, thumbnail } = data;
    const { id } = data;
    await Playlist.create({
      ...data,
      provider_id: id,
      owner: owner,
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
exports.findOnePlaylist = async (id) => {
  try {
    // const playlist = await Playlist.find({ owner: id });
    // return playlist;
  } catch (error) {
    throw error;
  }
};

exports.findAllPlaylist = async (limit, last_id) => {
  try {
    if (!last_id) {
      //page1
      const playlist = await Playlist.find({ display: true })
        .sort({ like: 1 })
        .limit(limit);
      return playlist;
    } else {
      //page2...
      const playlist = await Playlist.find({
        _id: { $gt: last_id },
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

exports.findUserPlaylist = async (limit, last_id, data) => {
  try {
    let privateQuery = {};
    if (data.isMine) {
      privateQuery = { $or: [{ private: true }, { private: false }] };
    } else {
      privateQuery = { private: true };
    }

    if (!last_id) {
      //page1
      const playlist = await Playlist.find({
        owner: owner,
        ...privateQuery,
      }).limit(limit);
      return playlist;
    } else {
      //page2...
      const playlist = await Playlist.find({
        _id: { $gt: last_id },
        owner: owner,
        ...privateQuery,
      }).limit(limit);
      return playlist;
    }
  } catch (error) {
    throw error;
  }
};

exports.findUserLibrary = async (data) => {
  try {
    const userData = await User.findOne({ _id: data.owner }).populate(
      "like_playlists"
    );
    const library = userData.like_playlists;
    return library;
  } catch (error) {
    throw error;
  }
};

exports.likePlaylist = async (playlist_id, user_id, status) => {
  try {
    switch (status) {
      case "up":
        await User.updateOne(
          { _id: user_id },
          { $addToSet: { like_playlists: playlist_id } }
        );
        await Playlist.updateOne({ _id: playlist_id }, { $inc: { like: 1 } });
        return;
      case "down":
        await User.updateOne(
          { _id: user_id },
          { $pullAll: { like_playlists: [playlist_id] } }
        );
        await Playlist.updateOne({ _id: playlist_id }, { $inc: { like: -1 } });
        return;
      default:
        throw new Error("likePlaylist type error");
    }
  } catch (error) {
    throw error;
  }
};

exports.changePrivatePlaylist = async (playlist_id, data, owner) => {
  try {
    await Playlist.updateOne(
      { _id: playlist_id, owner: owner },
      { private: data.private }
    );
  } catch (error) {
    throw error;
  }
};

exports.deletePlaylist = async (playlist_id, owner) => {
  try {
    await Playlist.deleteOne({ _id: playlist_id, owner: owner });
    return;
  } catch (error) {
    throw error;
  }
};
