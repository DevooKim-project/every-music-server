const Playlist = require("../../database/schema/playlist");
const User = require("../../database/schema/user");
// const { playlist } = require("../playlist/youtube");

//플레이리스트 저장
exports.storePlaylist = async (data) => {
  try {
    const { playlist, track_ids, user_id } = data;
    console.log(data);
    await Playlist.create({
      ...playlist,
      provider_id: playlist.id,
      owner: user_id,
      tracks: track_ids,
    });
    return;
  } catch (error) {
    throw error;
  }
};

//플레이리스트의 트랙 검색
exports.findTrackOfPlaylist = async (data) => {
  try {
    const playlist = await Playlist.findOne({
      _id: data.playlist_id,
    }).populate("tracks");
    return playlist.tracks;
  } catch (error) {
    throw error;
  }
};

//모든 플레이리스트 검색
exports.findAllPlaylist = async (limit, last_id) => {
  try {
    if (!last_id) {
      //page1
      const playlist = await Playlist.find({ private: false })
        .sort({ like: 1 })
        .limit(limit);
      return playlist;
    } else {
      //page2...
      const playlist = await Playlist.find({
        _id: { $gt: last_id },
        private: false,
      })
        .sort({ like: 1 })
        .limit(limit);
      return playlist;
    }
  } catch (error) {
    throw error;
  }
};

//유저가 업로드한 플레이리스트
exports.findUserPlaylist = async (limit, last_id, data) => {
  try {
    let privateQuery = {};
    if (data.isMine) {
      privateQuery = { $or: [{ private: true }, { private: false }] };
    } else {
      privateQuery = { private: false };
    }

    if (!last_id) {
      //page1
      const playlist = await Playlist.find({
        owner: data.owner,
        ...privateQuery,
      }).limit(limit);
      return playlist;
    } else {
      //page2...
      const playlist = await Playlist.find({
        _id: { $gt: last_id },
        owner: data.owner,
        ...privateQuery,
      }).limit(limit);
      return playlist;
    }
  } catch (error) {
    throw error;
  }
};

//유저가 좋아요 누른 플레이리스트(라이브러리)
exports.findUserLibrary = async (data) => {
  try {
    const userData = await User.findOne({ _id: data.user_id }).populate(
      "like_playlists"
    );
    const playlist_id = userData.like_playlists;
    const library = await Playlist.find({ _id: { $in: playlist_id } });

    return library;
  } catch (error) {
    throw error;
  }
};

//유저가 좋아요 누름
exports.likePlaylist = async (data) => {
  try {
    switch (data.status) {
      case "up":
        await User.updateOne(
          { _id: data.user_id },
          { $addToSet: { like_playlists: data.playlist_id } }
        );
        await Playlist.updateOne(
          { _id: data.playlist_id },
          { $inc: { like: 1 } }
        );
        return;
      case "down":
        await User.updateOne(
          { _id: data.user_id },
          { $pullAll: { like_playlists: [data.playlist_id] } }
        );
        await Playlist.updateOne(
          { _id: data.playlist_id },
          { $inc: { like: -1 } }
        );
        return;
      default:
        throw new Error("likePlaylist type error");
    }
  } catch (error) {
    throw error;
  }
};

//본인의 플레이리스트 공개 변경
exports.changePrivatePlaylist = async (data) => {
  try {
    await Playlist.updateOne(
      { _id: playlist_id, owner: data.user_id },
      { private: data.private }
    );
  } catch (error) {
    throw error;
  }
};

//본인의 플레이리스트 삭제
exports.deletePlaylist = async (data) => {
  try {
    await Playlist.deleteOne({ _id: data.playlist_id, owner: data.user_id });
    return;
  } catch (error) {
    throw error;
  }
};
