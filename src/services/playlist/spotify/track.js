const axios = require("axios");

const { cacheService } = require("../../database");

const getIdFromPlayList = async (id, token) => {
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
      data.items.forEach((item) => {
        const track = parseTrackItem(item.track);
        tracks.push(track);

        //insert data to redis
        // cacheService.addArtist(track.artists[0], "spotify");
        cacheService.addTrack(track, "spotify");
      });
      options.url = data.next;
    } while (options.url);

    return { tracks };
  } catch (error) {
    console.error(error);
    throw new Error(error);
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

module.exports = { getIdFromPlayList, searchIdFromProvider, add };

const parseTrackItem = (track) => {
  const artists = [];
  track.artists.forEach((artist) => {
    artists.push({
      name: artist.name,
      id: artist.id,
    });
  });
  return {
    id: track.id,
    title: track.name,
    artists: artists,
    album: {
      name: track.album.name,
      id: track.album.id,
    },
    duration_ms: track.duration_ms,
    track_number: track.track_number,
    thumbnail: track.album.images[0],
  };
};
