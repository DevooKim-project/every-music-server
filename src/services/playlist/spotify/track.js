const axios = require("axios");

const { trackService } = require("../../database");
const { storeArtistTrack } = require("../common");

exports.getFromPlaylist = async (id, token) => {
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
        track = await storeArtistTrack(track, "spotify");

        tracks.push(track);
      }
      options.url = data.next;
    } while (options.url);

    return { tracks };
  } catch (error) {
    throw error;
  }
};

exports.searchIdFromProvider = async (tracks, token) => {
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

    const provider_track_ids = [];
    const local_track_ids = [];
    for (const t of tracks) {
      //1. 아티스트 로컬 Id와 트랙 명으로 캐시에서 트랙 검색 (트랙과 아티스트는 모두 로컬id를 가지고 있음)
      //2. 트랙의 서비스 id가 있는지 확인
      //3. 있는 경우 그대로 저장
      //4. 없는 경우 요청 보내고 저장

      const artist = t.artist;
      let track = await trackService.findTrack(t.title, artist.ids.local);
      const local_track_id = track._id;
      local_track_ids.push(local_track_id);
      let provider_track_id = "";
      if (track.provider_id.spotify) {
        console.log("cached");
        provider_track_id = track.provider_id.spotify;
      } else {
        console.log("not Cache");
        // const artist = t.artists[0];

        const query = `${t.title} artist: "${artist.name}"`;
        params.q = query;
        const response = await axios(options);
        const items = response.data.tracks.items;
        if (items.length !== 0) {
          provider_track_id = items[0].id;
          // console.log("getTrack: ", provider_track_id);
        } else {
          console.log("not found");
        }
      }

      provider_track_ids.push(`spotify:track:${provider_track_id}`);
    }

    // return provider_track_ids;
    return { provider: provider_track_ids, local: local_track_ids };
  } catch (error) {
    throw error;
  }
};

exports.insert = async (playlist_id, track_ids, token) => {
  try {
    const data = {
      uris: track_ids,
    };
    const options = {
      method: "POST",
      url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
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
