const jwt = require("jsonwebtoken");

const { youtubeService, splitArray } = require("../../../services/playlist");
const { tokenService, playListService } = require("../../../services/database");
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
    req.userId = userId;
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
      for (const t of splitArray(trackId, 50)) {
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

    const trackIdData = [];
    for (let i = 0; i < playLists.length; i++) {
      // const newPlayList = await youtubeService.playList.create(
      //   playLists[i],
      //   accessToken
      // );

      console.log("createPlayList ok");

      const trackIds = await youtubeService.track.searchCache(
        tracks[i],
        accessToken
      );
      const providerIds = trackIds.provider;
      const localIds = trackIds.local;
      trackIdData.push(localIds);
      console.log("get trackIds ok");
      // await youtubeService.track.add(newPlayList.id, providerIds, accessToken);
    }

    // res.send("finish");
    res.send(trackIdData);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.savePlayList = async (req, res) => {
  try {
    const userId = req.userId;
    const { playLists, trackIds } = req.body;
    await playListService.storePlayList(playLists, trackIds, userId);
  } catch (error) {
    throw error;
  }
};
