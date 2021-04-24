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
    // console.log("outter: ", track);
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

  const playlistItems = [];
  for (let i = 0; i < playlists.length; i++) {
    const newPlaylist = await spotifyService.createPlaylistToPlatform(playlists[i], platformId, accessToken);
    console.log("create playlist");

    const trackIds = await spotifyService.getTrackIdFromPlatform(tracks[i], accessToken);

    playlistItems.push(trackIds.local);

    console.log("get trackId");
    // //*spotify* 한번에 최대 100개까지 아이템 생성 가능
    for (const trackId of splitArray(trackIds.platform, 100)) {
      await spotifyService.insertTrackToPlatform(newPlaylist.id, trackId, accessToken);
    }
    console.log("insert track");
  }

  // res.send({ playlists, trackIds: playlistItems });
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  getPlaylistFromPlatform,
  getItemFromPlatform,
  createPlaylistToPlatform,
};
