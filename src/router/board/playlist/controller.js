const jwt = require("jsonwebtoken");

const { parseToken } = require("../../../middleware/auth");
const { playlistService } = require("../../../services/database");

const readAllPlaylist = async (req, res) => {
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
const readMyPlaylist = async (req, res) => {
  try {
    // maxResult: default 10
    const maxResult = req.params.maxResult ? req.params.maxResult : 10;
    const last_id = req.params.last_id;

    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.id;

    const playlist = await playlistService.findUserPlaylist(
      maxResult,
      last_id,
      userId
    );

    res.send(playlist);
  } catch (error) {
    throw error;
  }
};

module.exports = { readAllPlaylist, readMyPlaylist };
