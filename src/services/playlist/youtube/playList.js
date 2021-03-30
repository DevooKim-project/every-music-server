const axios = require("axios");

const search = async (token) => {
  try {
    const params = {
      part: "snippet",
      maxResults: 50,
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

const create = async (playList, token) => {
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

    // const newPlayLists = [];
    // for (const playList of playLists) {
    //   data.snippet.title = playList.title;
    //   const response = await axios(options);
    //   newPlayLists.push(response.data.id);
    // }

    // return newPlayLists;
    data.snippet.title = playList.title;
    const response = await axios(options);
    const id = response.data.id;
    return { id: id };
  } catch (error) {
    throw error;
  }
};

module.exports = { search, create };

//not exports

const parsePlayList = (playList) => {
  return {
    id: playList.id,
    title: playList.snippet.title,
    thumbnail: playList.snippet.thumbnails.default.url,
    description: playList.snippet.description,
    owner: {
      name: playList.snippet.channelTitle,
      id: playList.snippet.channelId,
    },
    provider: "youtube",
  };
};
