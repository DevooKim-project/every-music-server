const httpStatus = require("http-status");

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
  const { platformId } = req.payload;
  const { playlists, tracks } = req.body;

  for (let i = 0; i < playlists.length; i++) {
    const createPlaylistPromise = spotifyService.createPlaylistToPlatform(playlists[i], platformId, accessToken);
    const getTrackIdsPromise = spotifyService.getTrackIdFromPlatform(tracks[i], accessToken);

    const [newPlaylist, trackIds] = await Promise.all([createPlaylistPromise, getTrackIdsPromise]);

    console.log("create playlist ok");
    console.log("get trackId ok");

    // //*spotify* 한번에 최대 100개까지 아이템 생성 가능
    for (const trackId of splitArray(trackIds.platform, 100)) {
      await spotifyService.insertTrackToPlatform(newPlaylist.id, trackId, accessToken);
    }
    console.log("insert track ok");
  }

  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  getPlaylistFromPlatform,
  getItemFromPlatform,
  createPlaylistToPlatform,
};
