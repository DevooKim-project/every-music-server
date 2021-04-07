const { spotifyService, splitArray } = require("../../../services/convert");
const { tokenService } = require("../../../services/database");

exports.getProviderTokenFromDB = async (req, res, next) => {
  try {
    const provider_token = await tokenService.findToken({
      provider: "spotify",
      user: req.payload.user_id,
    });
    req.provider_token = provider_token;
    next();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.searchPlaylist = async (req, res) => {
  try {
    const provider_token = req.provider_token;
    const item = await spotifyService.playlist.search(
      provider_token.access_token
    );

    res.json(item);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.getTrack = async (req, res) => {
  try {
    const provider_token = req.provider_token;
    const { playlists } = req.body;

    const tracks = [];
    for (const playlist of playlists) {
      const item = await spotifyService.track.getFromPlaylist(
        playlist.id,
        provider_token.access_token
      );
      tracks.push(item.tracks);
    }

    res.json({
      playlists: playlists,
      tracks: tracks,
    });
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.insertMusic = async (req, res) => {
  try {
    const provider_token = req.provider_token;
    const provider_id = req.payload.provider_id;
    const { playlists, tracks } = req.body;

    const playlist_items = [];
    for (let i = 0; i < playlists.length; i++) {
      // const new_playlist = await spotifyService.playlist.create(
      //   playlists[i],
      //   provider_id,
      //   provider_token.access_token
      // );
      console.log("createPlaylist ok");

      const track_ids = await spotifyService.track.searchIdFromProvider(
        tracks[i],
        provider_token.access_token
      );
      const provider_track_ids = track_ids.provider;
      const local_track_ids = track_ids.local;
      playlist_items.push(local_track_ids);
      console.log("get track_ids ok");

      //한번에 최대 100개 가능
      // for (const t of splitArray(provider_track_ids, 100)) {
      //   await spotifyService.track.insert(new_playlist.id, t, provider_token.access_token);
      // }
    }

    // res.send("finish");
    res.send({ playlists, track_ids: playlist_items });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.storePlaylist = async (req, res) => {
  try {
    const user_id = req.payload.user_id;
    const { playlists, track_ids } = req.body;
    await spotifyService.playlist.store({
      playlists: playlists,
      track_ids: track_ids,
      user_id: user_id,
    });
  } catch (error) {
    res.send(error);
  }
};
