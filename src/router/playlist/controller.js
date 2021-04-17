const { playlistService } = require("../../services/database");
const { uploadPlaylist } = require("../../services/convert");
//private: false인 모든 플레이리스트
exports.readAllPlaylist = async (req, res) => {
  try {
    //skip의 성능은 좋지 않다. 따라서 마지막 id값을 이용하여 기능을 구현한다.
    // max_result: default 10
    const max_result = req.query.maxResult || 10;
    const lastid = req.query.lastId;

    const playlists = await playlistService.findAllPlaylist(max_result, lastid);

    res.send(playlists);
  } catch (error) {
    res.send(error);
  }
};

exports.uploadPlaylist = async (req, res) => {
  try {
    const userid = req.payload.userid;
    const { playlists, trackids } = req.body;

    for (let i = 0; i < playlists.length; i++) {
      await uploadPlaylist({
        playlist: playlists[i],
        trackids: trackids[i],
        userid: userid,
      });
    }
    res.send("fin");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

//좋아요 버튼 기능
exports.likePlaylist = async (req, res) => {
  try {
    await playlistService.likePlaylist({
      playlistid: req.params.playlistid,
      userid: req.payload.userid,
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
      id: req.params.playlistid,
      owner: req.payload.userid,
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
    const playlistid = req.params.playlistid;
    const userid = req.payload.userid;
    const data = { playlistid, userid };
    await playlistService.deletePlaylist(data);
    res.status(204).send("delete playlist ok");
  } catch (error) {
    res.send(error);
  }
};
