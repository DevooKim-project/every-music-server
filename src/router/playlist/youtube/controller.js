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
    // const item = await youtubeService.searchList(accessToken);
    const item = await youtubeService.playList.search(accessToken);

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
      // const item = await youtubeService.getPlayListItem(id, accessToken);
      const item = await youtubeService.track.getId(id, accessToken);
      trackIds.push(item.trackIds);
    }

    //trackId로 track을 가져온다.
    const trackInfos = [];
    for (const trackId of trackIds) {
      //한번에 최대 50개 가능
      const tracks = [];
      for (const t of youtubeService.splitArray50(trackId)) {
        console.log(t.length);
        const item = await youtubeService.track.getInfo(t, accessToken);
        tracks.push(item.trackInfos);
      }

      //50개로 나누어진 배열 결합
      if (tracks.length !== 0) {
        trackInfos.push(
          tracks.reduce((prev, current) => {
            return prev.concat(current);
          })
        );
      }
    }

    //PlayList와 track은 인덱스로 매칭
    res.json({
      playLists: playLists,
      tracks: trackInfos,
    });
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.insertMusic = async (req, res) => {
  try {
    const accessToken = req.accessToken;
    const { playLists, tracks } = req.body;
    // const { from } = req.params;

    // const newPlayList = ["PL7ylSe17PUm44SjRkrWZx2dinqM3a0Dw-"];
    for (const i = 0; i < playLists.length; i++) {
      // const newPlayList = await youtubeService.playList.create(
      //   playLists[i],
      //   accessToken
      // );
      console.log("createPlayList");
      // const trackIds = await youtubeService.track.search(
      //   tracks[i],
      //   accessToken
      // );
      const trackIds = await youtubeService.track.searchLight(
        tracks[i],
        accessToken
      );
      console.log("trackIds", trackIds);
      await youtubeService.track.create(newPlayList.id, trackIds, accessToken);
    }

    res.send("finish");
  } catch (error) {
    // console.error(error);
    res.send(error);
  }
};
