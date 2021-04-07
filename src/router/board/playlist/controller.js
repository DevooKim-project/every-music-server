const jwt = require("jsonwebtoken");

const { parseToken } = require("../../../middleware/auth");
const { playlistService, userService } = require("../../../services/database");

// exports.getUserId = async (req, res, next) => {
//   try {
//     const localToken = parseToken(req.headers.authorization);
//     const payload = jwt.verify(localToken, process.env.JWT_SECRET);
//     const user_id = payload.user_id;
//     req.user_id = user_id;
//     next();
//   } catch (error) {
//     console.error(error);
//     res.send(error);
//   }
// };

//private: false인 모든 플레이리스트
exports.readAllPlaylist = async (req, res) => {
  try {
    //skip의 성능은 좋지 않다. 따라서 마지막 id값을 이용하여 기능을 구현한다.

    // max_result: default 10
    const max_result = req.params.max_result ? req.params.max_result : 10;
    const last_id = req.params.last_id;

    const playlist = await playlistService.findAllPlaylist(max_result, last_id);

    res.send(playlist);
  } catch (error) {
    throw error;
  }
};

//특정 유저가 올린 플레이리스트
exports.readUserPlaylist = async (req, res) => {
  try {
    // max_result: default 10
    const max_result = req.params.max_result || 10;
    const lastId = req.params.lastId;
    const user_id = req.user_id;
    const data = {
      owner: user_id,
      isMine: user_id === req.user,
    };

    const playlist = await playlistService.findUserPlaylist(
      max_result,
      lastId,
      data
    );

    res.send(playlist);
  } catch (error) {
    throw error;
  }
};

//내가 좋아요 누른 플레이리스트(라이브러리)
exports.readMyLibrary = async (req, res) => {
  try {
    const user_id = req.user_id;
    const data = {
      owner: user_id,
      isMine: user_id === req.user,
    };
    const playlist = await playlistService.findUserLibrary(data);

    res.send(playlist);
  } catch (error) {
    res.send(error);
  }
};

//좋아요 버튼 기능
exports.likePlaylist = async (req, res) => {
  try {
    const { playlist_id } = req.body;
    const user_id = req.payload.user_id;
    const status = req.params.status;
    await playlistService.likePlaylist(playlist_id, user_id, status);
    res.send("like playlist ok");
    // const playlist =
  } catch (error) {
    res.send(error);
  }
};

exports.changePrivatePlaylist = async (req, res) => {
  try {
    const { playlist_id, private } = req.body;
    const user_id = req.payload.user_id;
    const altPrivate = !private;
    await playlistService.changePrivatePlaylist(
      playlist_id,
      { private: altPrivate },
      user_id
    );
    res.send("change private playlist ok");
  } catch (error) {
    res.send(error);
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const { playlist_id } = req.body;
    const user_id = req.payload.user_id;
    await playlistService.deletePlaylist(playlist_id, user_id);
    res.send("delete playlist ok");
  } catch (error) {
    res.send(error);
  }
};
