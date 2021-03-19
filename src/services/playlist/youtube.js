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
      const response = await axios(options);
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
      const response = await axios(options);
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

const createPlayList = async (playLists, token) => {
  try {
    const params = {
      part: "snippet",
    };
    const data = {
      snippet: {
        title: "",
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

    const newPlayLists = [];
    for (const playList of playLists) {
      data.snippet.title = playList.title;
      const response = await axios(options);
      newPlayLists.push(response.data.id);
    }

    return newPlayLists;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const insertTracks = async (id, tracks, token) => {
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

module.exports = {
  searchList,
  getPlayListItem,
  getTrackInfo,
  createPlayList,
  insertTracks,
  splitArray50,
};

//not exports//
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
