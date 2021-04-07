const { playlistService } = require("../../services/database");

exports.readTrackOfPlaylist = async (req, res) => {
  try {
    const track = await playlistService.findTrackOfPlaylist({
      playlist_id: req.params.playlist_id,
    });
    res.status(200).send(track);
  } catch (error) {
    res.send(error);
  }
};
