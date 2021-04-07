const jwt = require("jsonwebtoken");

const { youtubeService, splitArray } = require("../../../services/playlist");
const { tokenService, playlistService } = require("../../../services/database");
const { parseToken } = require("../../../middleware/auth");

exports.getAccessToken = async (req, res, next) => {
  try {
    const localToken = parseToken(req.headers.authorization);
    const payload = jwt.verify(localToken, process.env.JWT_SECRET);
    const userId = payload.user_id;
    const access_token = await tokenService.findToken(userId, {
      provider: "google",
      type: "access",
    });
    req.access_token = access_token;
    req.userId = userId;
    next();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.searchPlaylist = async (req, res) => {
  try {
    const access_token = req.access_token;
    // const item = await youtubeService.searchList(access_token);
    const item = await youtubeService.playlist.search(access_token);

    res.json(item);
  } catch (error) {
    res.send(error);
  }
};

exports.getTracks = async (req, res) => {
  try {
    const access_token = req.access_token;

    //playlist에서 trackId를 가져온다.
    const { playlists } = req.body;

    const trackIds = [];
    for (const playlist of playlists) {
      const id = playlist.id;
      // const item = await youtubeService.getPlaylistItem(id, access_token);
      const item = await youtubeService.track.getId(id, access_token);
      trackIds.push(item.trackIds);
    }
    //trackId로 track을 가져온다.
    const trackInfos = [];
    for (const trackId of trackIds) {
      //한번에 최대 50개 가능
      const tracks = [];
      for (const t of splitArray(trackId, 50)) {
        console.log(t.length);
        const item = await youtubeService.track.getInfo(t, access_token);
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

    //Playlist와 track은 인덱스로 매칭
    res.json({
      playlists: playlists,
      tracks: trackInfos,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.status(400).send(error);
  }
};

exports.insertMusic = async (req, res) => {
  try {
    const access_token = req.access_token;
    const { playlists, tracks } = req.body;

    const trackIdData = [];
    for (let i = 0; i < playlists.length; i++) {
      // const newPlaylist = await youtubeService.playlist.create(
      //   playlists[i],
      //   access_token
      // );

      console.log("createPlaylist ok");

      const trackIds = await youtubeService.track.searchCache(
        tracks[i],
        access_token
      );
      const providerIds = trackIds.provider;
      const localIds = trackIds.local;
      trackIdData.push(localIds);
      console.log("get trackIds ok");
      // await youtubeService.track.add(newPlaylist.id, providerIds, access_token);
    }

    // res.send("finish");
    res.send(trackIdData);
  } catch (error) {
    res.send(error);
  }
};

exports.savePlaylist = async (req, res) => {
  try {
    const userId = req.userId;
    const { playlists, trackIds } = req.body;
    await playlistService.storePlaylist(playlists, trackIds, userId);
  } catch (error) {
    throw error;
  }
};
