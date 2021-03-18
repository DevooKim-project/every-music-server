const axios = require("axios");

const searchList = async (token) => {
  try {
    const params = {
      part: "snippet",
      maxResults: 5,
      mine: true,
      pageToken: "",
    };
    const options = {
      method: "GET",
      url: "https://www.googleapis.com/youtube/v3/playlists",
      headers: {
        authorization: `Bearer ${token}`,
      },
      params,
    };

    const playLists = [];
    do {
      const response = await axios(options, params);
      const { data } = response;

      data.items.forEach((item) => {
        playLists.push(parsePlayList(item));
      });

      params.pageToken = data.nextPageToken;
    } while (params.pageToken);

    return { playLists };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const getPlayListItem = async (id, token) => {
  try {
    const params = {
      part: "contentDetails",
      maxResults: 50,
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
      const response = await axios(options, params);
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

const getTrackInfo = async (id, token) => {
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
      const response = await axios(options, params);
      const { data } = response;
      data.items.forEach((item) => {
        trackInfos.push(parseTrackInfo(item));
      });

      params.pageToken = data.nextPageToken;
    } while (params.pageToken);

    return { trackInfos };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const parsePlayList = (playList) => {
  return {
    id: playList.id,
    title: playList.snippet.title,
    thumbnail: playList.snippet.thumbnails.default,
    description: playList.snippet.description,
    owner: {
      name: playList.snippet.channelTitle,
      id: playList.snippet.channelId,
    },
  };
};

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
    artist: artist,
    album: album,
    thumbnail: track.snippet.thumbnails.default,
  };
};

const splitArray50 = (array) => {
  let start = 0;
  let end = 50;
  const result = [];
  while (start < array.length) {
    result.push(array.slice(start, end));
    start = end;
    end += 50;
  }
  return result;
};

const setLocalPlayList = (array) => {};

module.exports = {
  searchList,
  getPlayListItem,
  getTrackInfo,
  splitArray50,
};
