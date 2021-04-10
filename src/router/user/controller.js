const { playlistService } = require("../../services/database");

//특정 유저가 올린 플레이리스트
exports.readUserPlaylist = async (req, res) => {
  try {
    const data = {
      user_id: req.params.user_id,
      isMine: req.payload.user_id === req.params.user_id,
    };
    const max_result = req.query.maxResult || 10;
    const last_id = req.query.lastId;

    const playlist = await playlistService.findUserPlaylist(
      data,
      max_result,
      last_id
    );
    res.send(playlist);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

//내가 좋아요 누른 플레이리스트(라이브러리)
exports.readLibrary = async (req, res) => {
  try {
    if (req.payload.user_id !== req.params.user_id) {
      res.status(400).send("토큰과 파라미터의 user_id 불일치");
    }
    const library = await playlistService.findUserLibrary(req.payload.user_id);

    res.status(200).send(library);
  } catch (error) {
    res.send(error);
  }
};
