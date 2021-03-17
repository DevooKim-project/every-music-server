const jwt = require("jsonwebtoken");

const { youtubeService } = require("../../../services/playlist");
const { tokenService } = require("../../../services/database");
const { parseToken } = require("../../../middleware/auth");

exports.searchPlayList = async (req, res) => {
  try {
    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.id;
    const accessToken = await tokenService.findToken(userId, {
      provider: "google",
      type: "access",
    });

    let data = await youtubeService.searchList(accessToken, " ");
    data = data.map((element) => {
      return youtubeService.parsePlayListData(element);
    });
    console.log(data.length);
    res.send(data);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.getPlayListItem = async (req, res, next) => {
  try {
    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.id;
    const accessToken = await tokenService.findToken(userId, {
      provider: "google",
      type: "access",
    });
    let { playLists } = req.body;
    const tracks = [];

    for (const playList of playLists) {
      const id = playList.id;
      const item = await youtubeService.getItems(id, accessToken, " ");
      tracks.push(item);
    }

    req.tracks = tracks;
    next();
    // res.send(tracks);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.getTrackInfo = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.structTrack = async (req, res) => {};
