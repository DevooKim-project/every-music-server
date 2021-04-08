const { playlistService } = require("../../services/database");

exports.readTrackOfPlaylist = async (req, res) => {
  try {
    const playlist_id = req.params.playlist_id;
    const track = await playlistService.findTrackOfPlaylist({
      playlist_id: playlist_id,
    });
    res.status(200).send(track);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
