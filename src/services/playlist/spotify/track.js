const axios = require("axios");

const { cacheService, artistService, trackService } = require("../../database");

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
        track = await storeData(track);

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
    for (const track of tracks) {
      // console.log(`track: ${artist.name} - ${track.title}`);
      console.log(`track:  - ${track.title}`);
      let trackId = await cacheService.getTrack(track, "spotify");
      console.log("TrackID: ", trackId);
      //캐시에 없는 경우
      if (!trackId) {
        console.log("not Cache");
        const artist = track.artists[0];

        const query = `${track.title} artist: "${artist.name}"`;
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

const storeData = async (trackData) => {
  try {
    //1. artist 확인 후 저장
    //2. artist local Id 객체에 저장
    //3. track title과 artist providerId로 확인 후 저장
    //4. 객체에 track local Id 객체에 저장
    let artist = await artistService.findArtist(trackData.artist.name);
    let artistId = "";
    // console.log("artist: ", artist);

    if (!artist) {
      console.log("store artist");
      artist = await artistService.storeArtist(trackData.artist);
    }
    artistId = {
      local: artist._id,
      ...artist.providerId,
    };

    let track = await trackService.findTrack(trackData.title, artistId.local);
    let trackId = "";

    if (!track) {
      console.log("store track");
      track = await trackService.storeTrack(trackData, artistId.local);
    }
    trackId = {
      local: track._id,
      ...track.providerId,
    };

    trackData.artist.ids = artistId;
    trackData.ids = trackId;

    return trackData;
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
