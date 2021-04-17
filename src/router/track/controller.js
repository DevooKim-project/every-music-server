const { playlistService } = require("../../services/database");

exports.readTrackOfPlaylist = async (req, res) => {
  try {
    const playlistid = req.params.playlistid;
    const track = await playlistService.findTrackOfPlaylist({
      playlistid: playlistid,
    });
    res.status(200).send(track);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
