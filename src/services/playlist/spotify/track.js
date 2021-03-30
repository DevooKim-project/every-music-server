const axios = require("axios");

const { trackService } = require("../../database");
const { storeData } = require("../common");

const getFromPlayList = async (id, token) => {
  try {
    const options = {
      method: "GET",
      url: `https://api.spotify.com/v1/playlists/${id}/tracks`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const tracks = [];
    do {
      const response = await axios(options);
      const { data } = response;
      // data.items.forEach(async (item) => {
      for (const item of data.items) {
        let track = parseTrackItem(item.track);
        //db 저장
        track = await storeData(track, "spotify");

        tracks.push(track);
      }
      options.url = data.next;
    } while (options.url);

    return { tracks };
  } catch (error) {
    throw error;
  }
};

const searchIdFromProvider = async (tracks, token) => {
  try {
    const params = {
      q: "",
      type: "track",
      limit: 1,
    };
    const options = {
      method: "GET",
      url: "https://api.spotify.com/v1/search",
      headers: {
        authorization: `Bearer ${token}`,
      },
      params,
    };

    const trackIds = [];
    for (const t of tracks) {
      //1. 아티스트 로컬 Id와 트랙 명으로 캐시에서 트랙 검색 (트랙과 아티스트는 모두 로컬id를 가지고 있음)
      //2. 트랙의 서비스 id가 있는지 확인
      //3. 있는 경우 그대로 저장
      //4. 없는 경우 요청 보내고 저장

      const artist = t.artist;
      let track = await trackService.findTrack(t.title, artist.ids.local);
      let trackId = "";
      if (track.providerId.spotify) {
        console.log("cached");
        trackId = track.providerId.spotify;
      } else {
        console.log("not Cache");
        // const artist = t.artists[0];

        const query = `${t.title} artist: "${artist.name}"`;
        params.q = query;
        const response = await axios(options);
        const items = response.data.tracks.items;
        if (items.length !== 0) {
          trackId = items[0].id;
          // console.log("getTrack: ", trackId);
        } else {
          console.log("not found");
        }
      }

      trackIds.push(`spotify:track:${trackId}`);
    }

    return trackIds;
  } catch (error) {
    throw error;
  }
};

const add = async (playListId, trackIds, token) => {
  try {
    const data = {
      uris: trackIds,
    };
    const options = {
      method: "POST",
      url: `https://api.spotify.com/v1/playlists/${playListId}/tracks`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      data,
    };

    await axios(options);

    return;
  } catch (error) {
    throw error;
  }
};

module.exports = { getFromPlayList, searchIdFromProvider, add };

const parseTrackItem = (track) => {
  const artist = track.artists[0];
  return {
    title: track.name,
    ids: {
      spotify: track.id,
    },
    artist: {
      name: artist.name,
      ids: {
        spotify: artist.id,
      },
    },
    duration_ms: track.duration_ms,
    thumbnail: track.album.images[0].url,
  };
};
