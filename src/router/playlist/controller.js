const { playlistService } = require("../../services/database");

//private: false인 모든 플레이리스트
exports.readAllPlaylist = async (req, res) => {
  try {
    //skip의 성능은 좋지 않다. 따라서 마지막 id값을 이용하여 기능을 구현한다.
    // max_result: default 10
    const max_result = req.query.maxResult || 10;
    const last_id = req.query.lastId;

    const playlist = await playlistService.findAllPlaylist(max_result, last_id);

    res.send(playlist);
  } catch (error) {
    throw error;
  }
};

//내가 좋아요 누른 플레이리스트(라이브러리)
exports.readLibrary = async (req, res) => {
  try {
    const library = await playlistService.findUserLibrary(req.payload.user_id);

    res.status(200).send(library);
  } catch (error) {
    res.send(error);
  }
};

//좋아요 버튼 기능
exports.likePlaylist = async (req, res) => {
  try {
    await playlistService.likePlaylist({
      playlist_id: req.body.playlist_id,
      user_id: req.payload.user_id,
      status: req.body.status,
    });
    res.status(204).send("like playlist ok");
    // const playlist =
  } catch (error) {
    res.send(error);
  }
};

exports.changePrivatePlaylist = async (req, res) => {
  try {
    await playlistService.changePrivatePlaylist({
      playlist_id: req.body.playlist_id,
      user_id: req.payload.user_id,
      private: !req.body.current_private,
    });
    res.status(204).send("change private playlist ok");
  } catch (error) {
    res.send(error);
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    await playlistService.deletePlaylist(
      req.params.playlist_id,
      req.payload.user_id
    );
    res.status(204).send("delete playlist ok");
  } catch (error) {
    res.send(error);
  }
};
