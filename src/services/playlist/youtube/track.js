const axios = require("axios");

const { cacheService } = require("../../database");

const getId = async (id, token) => {
  try {
    const params = {
      part: "contentDetails",
      maxResults: 5,
      playlistId: id,
    };
    const options = {
      method: "GET",
      url: "https://www.googleapis.com/youtube/v3/playlistItems",
      headers: {
        authorization: `Bearer ${token}`,
      },
      params,
    };

    const trackIds = [];
    do {
      const response = await axios(options);
      const { data } = response;
      data.items.forEach((item) => {
        trackIds.push(parseTrackItem(item));
      });

      params.pageToken = data.nextPageToken;
    } while (params.pageToken);

    return { trackIds };
  } catch (error) {
    // console.error(error);
    throw new Error(error);
  }
};

const getInfo = async (id, token) => {
  try {
    const params = {
      part: "snippet",
      id: id.toString(),
    };
    const options = {
      method: "GET",
      url: "https://www.googleapis.com/youtube/v3/videos",
      headers: {
        authorization: `Bearer ${token}`,
      },
      params,
    };

    const trackInfos = [];
    do {
      const response = await axios(options);
      const { data } = response;
      data.items.forEach((item) => {
        const track = parseTrackInfo(item);
        trackInfos.push(track);

        //insert data to redis
        const key = `artist-${track.artists[0].name}-google`;
        const value = track.artists.id;

        cacheService.addCacheSet(key, value);
      });

      params.pageToken = data.nextPageToken;
    } while (params.pageToken);

    return { trackInfos };
  } catch (error) {
    throw error;
  }
};

const create = async (id, tracks, token) => {
  try {
    const params = {
      part: "snippet",
    };
    const data = {
      snippet: {
        playlistId: id,
        resourceId: tracks,
      },
    };
    const options = {
      method: "POST",
      url: "https://www.googleapis.com/youtube/v3/playlists",
      headers: {
        authorization: `Bearer ${token}`,
      },
      params,
      data,
    };

    const newTracks = [];
    for (const track of tracks) {
      data.snippet.resourceId = track.id;
      const response = await axios(options);
      newTracks.push(response.data);
    }

    return newTracks;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = { getId, getInfo, create };

//not exports
const parseTrackItem = (trackId) => {
  return trackId.contentDetails.videoId;
};

const parseTrackInfo = (track) => {
  const artist = {
    name: track.snippet.channelTitle.replace(/ - Topic/, ""),
    id: track.snippet.channelId,
  };
  const album = {
    // name: track.snippet.tags[1],
    // id: "",
  };

  return {
    id: track.id,
    title: track.snippet.title,
    artists: [artist],
    album: album,
    thumbnail: track.snippet.thumbnails.default,
  };
};
