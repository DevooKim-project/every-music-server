const axios = require("axios");
const { storePlaylist } = require("../../database/playlist");

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

    const playlists = [];
    do {
      const response = await axios(options);
      const { data } = response;

      data.items.forEach((item) => {
        playlists.push(parsePlaylist(item));
      });

      params.pageToken = data.nextPageToken;
    } while (params.pageToken);

    return { playlists };
  } catch (error) {
    throw error;
  }
};

const create = async (playlist, token) => {
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
      url: "https://www.googleapis.com/youtube/v3/playLists",
      headers: {
        authorization: `Bearer ${token}`,
      },
      params,
      data,
    };

    // const newPlaylists = [];
    // for (const playlist of playlists) {
    //   data.snippet.title = playlist.title;
    //   const response = await axios(options);
    //   newPlaylists.push(response.data.id);
    // }

    // return newPlaylists;
    data.snippet.title = playlist.title;
    const response = await axios(options);
    const id = response.data.id;
    return { id: id };
  } catch (error) {
    throw error;
  }
};

const store = async (playlist, trackIds, userId) => {
  try {
    await storePlaylist(playlist, trackIds, userId);
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = { search, create, store };

//not exports

const parsePlaylist = (playlist) => {
  return {
    id: playlist.id,
    title: playlist.snippet.title,
    thumbnail: playlist.snippet.thumbnails.default.url,
    description: playlist.snippet.description,
    owner: {
      name: playlist.snippet.channelTitle,
      id: playlist.snippet.channelId,
    },
    provider: "youtube",
  };
};
