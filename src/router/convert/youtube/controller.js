const {
  youtubeService,
  uploadPlaylist,
  splitArray,
} = require("../../../services/convert");
const { tokenService } = require("../../../services/database");

exports.getProviderTokenFromDB = async (req, res, next) => {
  try {
    const provider_token = await tokenService.findToken({
      provider: "google",
      user: req.payload.userid,
    });
    req.provider_token = provider_token;
    next();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};

exports.searchPlaylist = async (req, res) => {
  try {
    const provider_token = req.provider_token;
    // const item = await youtubeService.searchList(access_token);
    const item = await youtubeService.playlist.search(
      provider_token.access_token
    );

    res.json(item);
  } catch (error) {
    res.send(error);
  }
};

exports.getTracks = async (req, res) => {
  try {
    const provider_token = req.provider_token;

    //playlist에서 trackid를 가져온다.
    const { playlists } = req.body;

    const trackids = [];
    for (const playlist of playlists) {
      const id = playlist.id;
      // const item = await youtubeService.getPlaylistItem(id, access_token);
      const item = await youtubeService.track.getId(
        id,
        provider_token.access_token
      );
      trackids.push(item.trackids);
    }
    //trackId로 track을 가져온다.
    const trackInfos = [];
    for (const trackid of trackids) {
      //한번에 최대 50개 가능
      const tracks = [];
      for (const t of splitArray(trackid, 50)) {
        console.log(t.length);
        const item = await youtubeService.track.getInfo(
          t,
          provider_token.access_token
        );
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
    const provider_token = req.provider_token;
    const { playlists, tracks } = req.body;

    const playlist_items = [];
    for (let i = 0; i < playlists.length; i++) {
      const new_playlist = await youtubeService.playlist.create(
        playlists[i],
        provider_token.access_token
      );
      console.log("createPlaylist ok");

      const trackids = await youtubeService.track.search(
        tracks[i],
        provider_token.access_token
      );
      console.log(trackids);
      const provider_trackids = trackids.provider;
      const local_trackids = trackids.local;
      playlist_items.push(local_trackids);
      console.log("get trackids ok");
      await youtubeService.track.insert(
        new_playlist.id,
        provider_trackids,
        provider_token.access_token
      );
    }

    // res.send("finish");
    res.send({ playlists, trackids: playlist_items });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.uploadPlaylist = async (req, res) => {
  try {
    const userid = req.payload.userid;
    const { playlists, trackids } = req.body;

    for (let i = 0; i < playlists.length; i++) {
      await uploadPlaylist({
        playlist: playlists[i],
        trackids: trackids[i],
        userid: userid,
      });
    }
    res.send("fin");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
