const jwt = require("jsonwebtoken");

const { youtubeService } = require("../../../services/playlist");
const { tokenService } = require("../../../services/database");
const { parseToken } = require("../../../middleware/auth");

exports.searchList = async (req, res) => {
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

exports.getItems = async (req, res) => {
  try {
    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.id;
    const accessToken = await tokenService.findToken(userId, {
      provider: "google",
      type: "access",
    });
    let { playLists } = req.body;
    // console.log(playLists);
    // playLists = playLists.split(" ");
    const tracks = [];

    for (const playList of playLists) {
      const id = playList.id;
      console.log("id: ", id);
      const item = await youtubeService.getItems(id, accessToken, " ");
      // console.log("item: ", item);
      // tracks = item.contentDetails.videoId;
      console.log("item: ", item.length);
      tracks.push(item);
    }
    console.log("tracks: ", tracks.length);
    res.send(tracks);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};
