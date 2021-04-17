const { playlistService } = require("../../services/database");

//특정 유저가 올린 플레이리스트
exports.readUserPlaylist = async (req, res) => {
  try {
    const data = {
      userid: req.params.userid,
      isMine: req.payload.userid === req.params.userid,
    };
    const max_result = req.query.maxResult || 10;
    const lastid = req.query.lastId;

    const playlists = await playlistService.findUserPlaylist(
      data,
      max_result,
      lastid
    );
    res.send({ isMine, playlists });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

//내가 좋아요 누른 플레이리스트(라이브러리)
exports.readLibrary = async (req, res) => {
  try {
    if (req.payload.userid !== req.params.userid) {
      res.status(400).send("토큰과 파라미터의 userid 불일치");
    }
    const library = await playlistService.findUserLibrary(req.payload.userid);

    res.status(200).send(library);
  } catch (error) {
    res.send(error);
  }
};
