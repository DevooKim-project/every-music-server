const { default: axios } = require("axios");

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

    const playList = [];
    do {
      const response = await axios(options, params);
      const { data } = response;
      playList.push(...data.items);

      params.pageToken = data.nextPageToken;
      console.log("test: ", params.pageToken);
    } while (params.pageToken);

    return playList;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const getPlayListItems = async (id, token, nextPageToken) => {
  try {
    const params = {
      part: "contentDetails",
      maxResults: 50,
      playlistId: id,
      pageToken: nextPageToken,
    };
    const options = {
      method: "GET",
      url: "https://www.googleapis.com/youtube/v3/playlistItems",
      headers: {
        authorization: `Bearer ${token}`,
      },
      params,
    };

    const playList = [];
    do {
      const response = await axios(options, params);
      const { data } = response;
      playList.push(...data.items);

      params.pageToken = data.nextPageToken;
    } while (params.pageToken);

    return playList;
  } catch (error) {
    // console.error(error);
    throw new Error(error);
  }
};

const getTrackInfo = async (id, token) => {
  try {
    const params = {
      part: "snippet",
      id: id,
    };
    const options = {
      method: "GET",
      url: "https://www.googleapis.com/youtube/v3/videos",
      headers: {
        authorization: `Bearer ${token}`,
      },
      params,
    };

    const response = await axios(options, params);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const parsePlayListData = (playList) => {
  return {
    id: playList.id,
    title: playList.snippet.title,
    thumbnail: playList.snippet.thumbnails,
    description: playList.snippet.description,
  };
};

const parseTrackData = (track) => {
  return {
    id: track[0].id,
  };
};

module.exports = {
  searchList,
  parsePlayListData,
  getPlayListItems,
  getTrackInfo,
};
