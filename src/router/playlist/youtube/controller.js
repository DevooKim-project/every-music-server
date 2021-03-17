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

exports.getTracks = async (req, res, next) => {
  try {
    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.id;
    const accessToken = await tokenService.findToken(userId, {
      provider: "google",
      type: "access",
    });

    //playList에서 trackId를 가져온다.
    let { playLists } = req.body;
    const trackIds = [];

    for (const playList of playLists) {
      const id = playList.id;
      const item = await youtubeService.getPlayListItems(id, accessToken, " ");
      console.log(item);
      trackIds.push(item);
    }

    //trackId로 trackInfo를 가져온다.

    //playList와 track을 합친다. (array index 매칭)

    res.send(trackIds);
    // res.send(tracks);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.getTrackInfo = async (req, res) => {
  try {
    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.id;
    const accessToken = await tokenService.findToken(userId, {
      provider: "google",
      type: "access",
    });

    const data = await youtubeService.getTrackInfo("UcOUJM08bYk", accessToken);
    res.send(data);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.structTrack = async (req, res) => {};
