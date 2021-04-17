const Playlist = require("../../database/schema/playlist");
const User = require("../../database/schema/user");
// const { playlist } = require("../playlist/youtube");

//플레이리스트 저장
exports.uploadPlaylist = async (data) => {
  try {
    const { playlist, trackids, userid } = data;
    console.log(data);
    await Playlist.create({
      ...playlist,
      providerid: playlist.id,
      owner: userid,
      tracks: trackids,
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
      id: data.playlistid,
    }).populate("tracks");
    return playlist.tracks;
  } catch (error) {
    throw error;
  }
};

//모든 플레이리스트 검색
exports.findAllPlaylist = async (limit, lastid) => {
  try {
    if (!lastid) {
      //page1
      const playlist = await Playlist.find({ private: false })
        .sort({ like: -1 })
        .limit(limit);
      return playlist;
    } else {
      //page2...
      const playlist = await Playlist.find({
        id: { $gt: lastid },
        private: false,
      })
        .sort({ like: -1 })
        .limit(limit);
      return playlist;
    }
  } catch (error) {
    throw error;
  }
};

//유저가 업로드한 플레이리스트
exports.findUserPlaylist = async (data, limit, lastid) => {
  try {
    let privateOption = {};
    if (data.isMine) {
      privateOption = { $or: [{ private: true }, { private: false }] };
    } else {
      privateOption = { private: false };
    }

    if (!lastid) {
      //page1
      const playlist = await Playlist.find({
        owner: data.userid,
        ...privateOption,
      }).limit(limit);
      return playlist;
    } else {
      //page2...
      const playlist = await Playlist.find({
        id: { $gt: lastid },
        owner: data.userid,
        ...privateOption,
      }).limit(limit);
      return playlist;
    }
  } catch (error) {
    throw error;
  }
};

//유저가 좋아요 누른 플레이리스트(라이브러리)
exports.findUserLibrary = async (userid) => {
  try {
    const userData = await User.findOne({ id: userid }).populate(
      "like_playlists"
    );
    const playlistid = userData.like_playlists;
    const library = await Playlist.find({
      id: { $in: playlistid },
    });

    return library;
  } catch (error) {
    throw error;
  }
};

//유저가 좋아요 누름
exports.likePlaylist = async (data) => {
  try {
    switch (data.operator) {
      case "like":
        await User.updateOne(
          { id: data.userid },
          { $addToSet: { like_playlists: data.playlistid } }
        );
        await Playlist.updateOne(
          { id: data.playlistid },
          { $inc: { like: 1 } }
        );
        return;
      case "unlike":
        await User.updateOne(
          { id: data.userid },
          { $pullAll: { like_playlists: [data.playlistid] } }
        );
        await Playlist.updateOne(
          { id: data.playlistid },
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
exports.updatePlaylistOptions = async (filter, update) => {
  try {
    await Playlist.updateOne(filter, { $set: update });
  } catch (error) {
    throw error;
  }
};

//본인의 플레이리스트 삭제
exports.deletePlaylist = async (data) => {
  try {
    await Playlist.deleteOne({ id: data.playlistid, owner: data.userid });
    return;
  } catch (error) {
    throw error;
  }
};
