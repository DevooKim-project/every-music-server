const { spotifyService } = require("../../../services");

const getPlaylistsFromPlatform = async (req, res) => {
  const platformToken = req.platformToken;
  const playlists = await spotifyService.getPlaylistsFromPlatform(
    platformToken.accessToken
  );
  res.send({ playlists });
};

const getTracksFromPlatform = async (req, res) => {
  const platformToken = req.platformToken;
  const { playlists } = req.body;

  const tracks = [];
  for (const playlist of playlists) {
    const track = await spotifyService;
  }
};

const saveTracks = async (req, res) => {};

module.exports = {
  getPlaylistsFromPlatform,
  getTracksFromPlatform,
};
