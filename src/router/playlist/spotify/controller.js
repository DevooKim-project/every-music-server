const jwt = require("jsonwebtoken");

const { spotifyService, splitArray } = require("../../../services/playlist");
const { tokenService } = require("../../../services/database");
const { parseToken } = require("../../../middleware/auth");

exports.getAccessToken = async (req, res, next) => {
  try {
    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const user_id = payload.user_id;
    const provider_id = payload.provider_id;
    const access_token = await tokenService.findToken(user_id, {
      provider: "spotify",
      type: "access",
    });
    req.access_token = access_token;
    req.provider_id = provider_id;
    next();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.searchPlaylist = async (req, res) => {
  try {
    const access_token = req.access_token;
    const item = await spotifyService.playlist.search(access_token);

    res.json(item);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.getTrack = async (req, res) => {
  try {
    const access_token = req.access_token;

    const { playlists } = req.body;

    const tracks = [];
    for (const playlist of playlists) {
      const item = await spotifyService.track.getFromPlaylist(
        playlist.id,
        access_token
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
    const access_token = req.access_token;
    const provider_id = req.provider_id;
    const { playlists, tracks } = req.body;

    const trackIdData = [];
    for (let i = 0; i < playlists.length; i++) {
      // const newPlaylist = await spotifyService.playlist.create(
      //   playlists[i],
      //   provider_id,
      //   access_token
      // );
      // const newPlaylist = { id: "3PaR6AIx3FaCb9k9XwMRjp" };
      console.log("createPlaylist ok");

      const track_ids = await spotifyService.track.searchIdFromProvider(
        tracks[i],
        access_token
      );
      const provider_ids = track_ids.provider;
      const localIds = track_ids.local;
      trackIdData.push(localIds);
      console.log("get track_ids ok");

      //한번에 최대 100개 가능
      // for (const t of splitArray(provider_ids, 100)) {
      //   await spotifyService.track.add(newPlaylist.id, t, access_token);
      // }
    }

    // res.send("finish");
    res.send({ playlists, track_ids: trackIdData });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.savePlaylist = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { playlists, track_ids } = req.body;
    await playlistService.storePlaylist(playlists, track_ids, user_id);
  } catch (error) {
    throw error;
  }
};
