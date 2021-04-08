const { playlistService } = require("../../services/database");

//특정 유저가 올린 플레이리스트
exports.readUserPlaylist = async (req, res) => {
  try {
    // max_result: default 10
    const max_result = req.query.maxResult || 10;
    const last_id = req.query.lastId;
    const { user_id } = req.params;
    const data = {
      owner: user_id,
      isMine: user_id === req.payload.user_id,
    };

    const playlist = await playlistService.findUserPlaylist(
      max_result,
      last_id,
      data
    );

    res.status(200).send(playlist);
  } catch (error) {
    throw error;
  }
};
