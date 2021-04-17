const {
  spotifyService,
  uploadPlaylist,
  splitArray,
} = require("../../../services/convert");
const { tokenService } = require("../../../services/database");

exports.getProviderTokenFromDB = async (req, res, next) => {
  try {
    const provider_token = await tokenService.findToken({
      provider: "spotify",
      user: req.payload.userid,
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
    const providerid = req.payload.providerid;
    const { playlists, tracks } = req.body;

    const playlist_items = [];
    for (let i = 0; i < playlists.length; i++) {
      const new_playlist = await spotifyService.playlist.create(
        playlists[i],
        providerid,
        provider_token.access_token
      );
      console.log("createPlaylist ok");

      const trackids = await spotifyService.track.searchIdFromProvider(
        tracks[i],
        provider_token.access_token
      );
      const provider_trackids = trackids.provider;
      const local_trackids = trackids.local;
      playlist_items.push(local_trackids);
      console.log("get trackids ok");

      //한번에 최대 100개 가능
      for (const t of splitArray(provider_trackids, 100)) {
        await spotifyService.track.insert(
          new_playlist.id,
          t,
          provider_token.access_token
        );
      }
    }

    // res.status(203).send("finish");
    res.send({ playlists, trackids: playlist_items });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.uploadPlaylist = async (req, res) => {
  try {
    const userid = req.payload.userid;
    const { playlists, trackids } = req.body;

    for (let i = 0; i < playlists.length; i++) {
      await uploadPlaylist({
        playlist: playlists[i],
        trackids: trackids[i],
        userid: userid,
      });
    }
    res.send("fin");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
