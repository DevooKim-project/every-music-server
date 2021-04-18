const { googleService } = require("../../../services");

const getPlaylistFromPlatform = async (req, res) => {
  const platformToken = req.platformToken;
  const playlists = await googleService.getPlaylistFromPlatform(
    platformToken.accessToken
  );
  res.send({ playlists });
};

const getItemFromPlatform = async (req, res) => {
  const platformToken = req.platformToken;
  const { playlists } = req.body;

  //1. 플레이리스트에서 트랙ID를 가져온다.
  const trackIds = [];
  for (const playlist of playlists) {
    const trackId = await googleService.getItemIdFromPlatform(
      playlist.platformId,
      platformToken.accessToken
    );
    trackIds.push(trackId);
  }
  console.log("tradkIds: ", trackIds);

  //2. 트랙ID로 트랙 정보를 가져온다.
  const tracks = [];
  for (const trackId of trackIds) {
    tracks.push(
      await googleService.iterateGetItemInfo(trackId, platformToken.accessToken)
    );
  }

  res.send({
    playlists: playlists,
    tracks: tracks,
  });
};

const createPlaylistToPlatform = async (req, res) => {
  const { accessToken } = req.platformToken;
  const { playlists, tracks } = req.body;

  const playlistItems = [];
  for (let i = 0; i < playlists.length; i++) {
    const newPlaylist = await googleService.createPlaylistToPlatform(
      playlists[i],
      accessToken
    );
    console.log("create playlist ok");

    const trackIds = await googleService.getTrackIdFromPlatform(
      tracks[i],
      accessToken
    );
    console.log("get trackId ok");
    playlistItems.push(trackIds.local);
    await googleService.insertTrackToPlatform(
      newPlaylist.id,
      trackIds.platform,
      accessToken
    );

    console.log("insert track ok");
  }

  res.send({ playlists, trackIds: playlistItems });
};

module.exports = {
  getPlaylistFromPlatform,
  getItemFromPlatform,
  createPlaylistToPlatform,
};
