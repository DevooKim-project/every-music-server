const { platformTypes } = require("../../../config/type");

const { spotifyService } = require("../../../services");
const splitArray = require("../../../utils/splitArray");

const getPlaylistFromPlatform = async (req, res) => {
  const platformToken = req.platformToken;
  const playlists = await spotifyService.getPlaylistFromPlatform(platformToken.accessToken);
  res.send({ playlists });
};

const getItemFromPlatform = async (req, res) => {
  const platformToken = req.platformToken;
  const { playlists } = req.body;
  const tracks = [];
  for (const playlist of playlists) {
    const track = await spotifyService.getItemFromPlatform(playlist.platformId, platformToken.accessToken);
    tracks.push(track);
  }

  res.send({
    playlists: playlists,
    tracks: tracks,
  });
};

const createPlaylistToPlatform = async (req, res) => {
  const { accessToken } = req.platformToken;
  let { platform, platformId } = req.payload;
  const { playlists, tracks } = req.body;

  if (platform !== platformTypes.SPOTIFY) {
    const profile = await spotifyService.getProfile(accessToken);
    platformId = profile.id;
  }

  const newPlaylists = [];
  for (let i = 0; i < playlists.length; i++) {
    const createPlaylistPromise = spotifyService.createPlaylistToPlatform(playlists[i], platformId, accessToken);
    const getTrackIdsPromise = spotifyService.getTrackIdFromPlatform(tracks[i], accessToken);

    const [newPlaylist, trackIds] = await Promise.all([createPlaylistPromise, getTrackIdsPromise]);

    // //*spotify* 한번에 최대 100개까지 아이템 생성 가능
    for (const trackId of splitArray(trackIds.platform, 100)) {
      await spotifyService.insertTrackToPlatform(newPlaylist.id, trackId, accessToken);
    }

    newPlaylists.push({ ...playlists[i], platformId: newPlaylist.id });
  }

  res.send({ playlists: newPlaylists });
};

module.exports = {
  getPlaylistFromPlatform,
  getItemFromPlatform,
  createPlaylistToPlatform,
};
