const jwt = require("jsonwebtoken");

const { spotifyService, splitArray } = require("../../../services/playlist");
const { tokenService } = require("../../../services/database");
const { parseToken } = require("../../../middleware/auth");

exports.getAccessToken = async (req, res, next) => {
  try {
    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.id;
    const providerId = payload.providerId;
    const accessToken = await tokenService.findToken(userId, {
      provider: "spotify",
      type: "access",
    });
    req.accessToken = accessToken;
    req.providerId = providerId;
    next();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.searchPlayList = async (req, res) => {
  try {
    const accessToken = req.accessToken;
    const item = await spotifyService.playList.search(accessToken);

    res.json(item);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.getTrack = async (req, res) => {
  try {
    const accessToken = req.accessToken;

    const { playLists } = req.body;

    const tracks = [];
    for (const playList of playLists) {
      const item = await spotifyService.track.get(playList.id, accessToken);
      tracks.push(item.tracks);
    }

    res.json({
      playLists: playLists,
      tracks: tracks,
    });
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.insertMusic = async (req, res) => {
  try {
    const accessToken = req.accessToken;
    const providerId = req.providerId;
    const { playLists, tracks } = req.body;

    for (let i = 0; i < playLists.length; i++) {
      const newPlayList = await spotifyService.playList.create(
        playLists[i],
        providerId,
        accessToken
      );
      // const newPlayList = { id: "3PaR6AIx3FaCb9k9XwMRjp" };
      console.log("createPlayList: ", newPlayList);

      const trackIds = await spotifyService.track.search(
        tracks[i],
        accessToken
      );
      console.log("trackIds");

      //한번에 최대 100개 가능
      for (const t of splitArray(trackIds, 100)) {
        await spotifyService.track.add(newPlayList.id, t, accessToken);
      }
    }

    res.send("finish");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
