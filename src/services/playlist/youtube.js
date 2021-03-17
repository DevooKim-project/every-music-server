const { default: axios } = require("axios");

const searchList = async (token, nextPageToken) => {
  try {
    const params = {
      part: "snippet",
      maxResults: 5,
      mine: true,
      pageToken: nextPageToken,
    };
    const options = {
      method: "GET",
      url: "https://www.googleapis.com/youtube/v3/playlists",
      headers: {
        authorization: `Bearer ${token}`,
      },
      params,
    };

    const response = await axios(options, params);
    const { data } = response;
    let recursive = [];

    if (data.nextPageToken) {
      recursive = await searchList(token, data.nextPageToken);
    }

    return [...data.items, ...recursive];
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const parsePlayListData = (playList) => {
  return {
    id: playList.id,
    title: playList.snippet.title,
    thumbnail: playList.snippet.thumbnails.default,
    description: playList.snippet.description,
  };
};

const getItems = async (id, token, nextPageToken) => {
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

    const response = await axios(options, params);
    const { data } = response;
    let recursive = [];
    if (data.nextPageToken) {
      recursive = await getItems(id, token, data.nextPageToken);
    }

    return [...data.items, ...recursive];
  } catch (error) {
    // console.error(error);
    throw new Error(error);
  }
};

module.exports = { searchList, parsePlayListData, getItems };
