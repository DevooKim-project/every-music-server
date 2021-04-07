const jwt = require("jsonwebtoken");

const { parseToken } = require("../../../middleware/auth");
const { playlistService, userService } = require("../../../services/database");

exports.getUserId = async (req, res, next) => {
  try {
    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.user_id;
    req.userId = userId;
    next();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

//private: false인 모든 플레이리스트
exports.readAllPlaylist = async (req, res) => {
  try {
    //skip의 성능은 좋지 않다. 따라서 마지막 id값을 이용하여 기능을 구현한다.

    // maxResult: default 10
    const maxResult = req.params.maxResult ? req.params.maxResult : 10;
    const last_id = req.params.last_id;

    const playlist = await playlistService.findAllPlaylist(maxResult, last_id);

    res.send(playlist);
  } catch (error) {
    throw error;
  }
};

//특정 유저가 올린 플레이리스트
exports.readUserPlaylist = async (req, res) => {
  try {
    // maxResult: default 10
    const maxResult = req.params.maxResult ? req.params.maxResult : 10;
    const lastId = req.params.lastId;
    const userId = req.userId;
    const data = {
      owner: userId,
      isMine: userId === req.user,
    };

    const playlist = await playlistService.findUserPlaylist(
      maxResult,
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
    const userId = req.userId;
    const data = {
      owner: userId,
      isMine: userId === req.user,
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
    const { playlistId } = req.body;
    const user = req.user;
    const status = req.params.status;
    await playlistService.likePlaylist(playlistId, user, status);
    res.send("like playlist ok");
    // const playlist =
  } catch (error) {
    res.send(error);
  }
};

exports.changePrivatePlaylist = async (req, res) => {
  try {
    const { playlistId, private } = req.body;
    const user = req.user;
    const altPrivate = !private;
    await playlistService.changePrivatePlaylist(
      playlistId,
      { private: altPrivate },
      user
    );
    res.send("change private playlist ok");
  } catch (error) {
    res.send(error);
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body;
    const user = req.user;
    await playlistService.deletePlaylist(playlistId, user);
    res.send("delete playlist ok");
  } catch (error) {
    res.send(error);
  }
};
