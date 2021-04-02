const axios = require("axios");

const { trackService } = require("../../database");
const { storeArtistTrack } = require("../common");

const getFromPlaylist = async (id, token) => {
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

    const trackProviderIds = [];
    const trackLocalIds = [];
    for (const t of tracks) {
      //1. 아티스트 로컬 Id와 트랙 명으로 캐시에서 트랙 검색 (트랙과 아티스트는 모두 로컬id를 가지고 있음)
      //2. 트랙의 서비스 id가 있는지 확인
      //3. 있는 경우 그대로 저장
      //4. 없는 경우 요청 보내고 저장

      const artist = t.artist;
      let track = await trackService.findTrack(t.title, artist.ids.local);
      const trackLocalId = track._id;
      trackLocalIds.push(trackLocalId);
      let trackProviderId = "";
      if (track.providerId.spotify) {
        console.log("cached");
        trackProviderId = track.providerId.spotify;
      } else {
        console.log("not Cache");
        // const artist = t.artists[0];

        const query = `${t.title} artist: "${artist.name}"`;
        params.q = query;
        const response = await axios(options);
        const items = response.data.tracks.items;
        if (items.length !== 0) {
          trackProviderId = items[0].id;
          // console.log("getTrack: ", trackProviderId);
        } else {
          console.log("not found");
        }
      }

      trackProviderIds.push(`spotify:track:${trackProviderId}`);
    }

    // return trackProviderIds;
    return { provider: trackProviderIds, local: trackLocalIds };
  } catch (error) {
    throw error;
  }
};

const add = async (playlistId, trackIds, token) => {
  try {
    const data = {
      uris: trackIds,
    };
    const options = {
      method: "POST",
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
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

module.exports = { getFromPlaylist, searchIdFromProvider, add };

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
