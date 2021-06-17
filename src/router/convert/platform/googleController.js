const { googleService } = require("../../../services");

const getPlaylistFromPlatform = async (req, res) => {
  const platformToken = req.platformToken;
  const playlists = await googleService.getPlaylistFromPlatform(platformToken.accessToken);
  res.send({ playlists });
};

const getItemFromPlatform = async (req, res) => {
  const platformToken = req.platformToken;
  const { playlists } = req.body;

  const tracks = [];
  for (const playlist of playlists) {
    tracks.push(await googleService.getItemFromPlatform(playlist.platformId, platformToken.accessToken));
  }

  res.send({
    playlists: playlists,
    tracks: tracks,
  });
};

const createPlaylistToPlatform = async (req, res) => {
  const { accessToken } = req.platformToken;
  const { playlists, tracks } = req.body;

  const newPlaylists = [];
  for (let i = 0; i < playlists.length; i++) {
    const createPlaylistPromise = googleService.createPlaylistToPlatform(playlists[i], accessToken);
    const getTrackIdsPromise = googleService.getTrackIdFromPlatform(tracks[i], accessToken);

    const [newPlaylist, trackIds] = await Promise.all([createPlaylistPromise, getTrackIdsPromise]);

    await googleService.insertTrackToPlatform(newPlaylist.id, trackIds.platform, accessToken);

    newPlaylists.push({ ...playlists[i], platformId: newPlaylist.id });
  }

  res.send({ playlists: newPlaylists });
};

module.exports = {
  getPlaylistFromPlatform,
  getItemFromPlatform,
  createPlaylistToPlatform,
};
