const jwt = require("jsonwebtoken");

const { spotifyService } = require("../../../services/playlist");
const { tokenService } = require("../../../services/database");
const { parseToken } = require("../../../middleware/auth");

exports.getAccessToken = async (req, res, next) => {
  try {
    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.id;
    const accessToken = await tokenService.findToken(userId, {
      provider: "spotify",
      type: "access",
    });
    req.accessToken = accessToken;
    next();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.searchPlayList = async (req, res) => {
  try {
    const accessToken = req.accessToken;
    const item = await spotifyService.searchList(accessToken);

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
      const item = await spotifyService.getTrack(playList.id, accessToken);
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
