const jwt = require("jsonwebtoken");

const { youtubeService } = require("../../../services/playlist");
const { tokenService } = require("../../../services/database");
const { parseToken } = require("../../../middleware/auth");

exports.getAccessToken = async (req, res, next) => {
  try {
    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.id;
    const accessToken = await tokenService.findToken(userId, {
      provider: "google",
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

    const item = await youtubeService.searchList(accessToken);

    console.log(item.playList.length);
    res.json(item);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.getTracks = async (req, res) => {
  try {
    const accessToken = req.accessToken;

    //playList에서 trackId를 가져온다.
    const { playLists } = req.body;
    const trackIds = [];

    for (const playList of playLists) {
      const id = playList.id;
      const item = await youtubeService.getPlayListItem(id, accessToken);
      trackIds.push(item.trackIds);
    }

    //trackId로 trackInfo를 가져온다.
    const trackInfos = [];
    for (const trackId of trackIds) {
      //한번에 최대 50개 가능
      const tracks = [];
      for (const t of youtubeService.splitArray50(trackId)) {
        console.log(t.length);
        const item = await youtubeService.getTrackInfo(t, accessToken);
        tracks.push(item.trackInfo);
      }

      //50개로 나누어진 배열 결합
      trackInfos.push(
        tracks.reduce((prev, current) => {
          return prev.concat(current);
        })
      );
    }

    //PlayList와 track은 인덱스로 매칭
    res.json({
      playList: playLists,
      track: trackInfos,
    });
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};
