const { playlistService } = require("../../services/database");

//private: false인 모든 플레이리스트
exports.readAllPlaylist = async (req, res) => {
  try {
    //skip의 성능은 좋지 않다. 따라서 마지막 id값을 이용하여 기능을 구현한다.
    // max_result: default 10
    const max_result = req.query.maxResult || 10;
    const last_id = req.query.lastId;

    const playlists = await playlistService.findAllPlaylist(
      max_result,
      last_id
    );

    res.send(playlists);
  } catch (error) {
    res.send(error);
  }
};

//좋아요 버튼 기능
exports.likePlaylist = async (req, res) => {
  try {
    await playlistService.likePlaylist({
      playlist_id: req.params.playlist_id,
      user_id: req.payload.user_id,
      operator: req.params.operator,
    });
    res.status(204).send("like playlist ok");
    // const playlist =
  } catch (error) {
    res.send(error);
  }
};

exports.updatePlaylistOptions = async (req, res) => {
  try {
    const filter = {
      _id: req.params.playlist_id,
      owner: req.payload.user_id,
    };
    const update = {};
    if (req.body.hasOwnProperty("title")) update.title = req.body.title;
    if (req.body.hasOwnProperty("description"))
      update.description = req.body.description;
    if (req.body.hasOwnProperty("thumbnail"))
      update.thumbnail = req.body.thumbnail;
    if (req.body.hasOwnProperty("private")) update.private = req.body.private;

    await playlistService.updatePlaylistOptions(filter, update);
    res.status(204).send("change private playlist ok");
  } catch (error) {
    res.send(error);
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const playlist_id = req.params.playlist_id;
    const user_id = req.payload.user_id;
    const data = { playlist_id, user_id };
    await playlistService.deletePlaylist(data);
    res.status(204).send("delete playlist ok");
  } catch (error) {
    res.send(error);
  }
};
