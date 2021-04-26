const axios = require("axios");

exports.search = async (access_token) => {
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
        authorization: `Bearer ${access_token}`,
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

exports.create = async (playlist, access_token) => {
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
        authorization: `Bearer ${access_token}`,
      },
      params,
      data,
    };

    data.snippet.title = playlist.title;
    const response = await axios(options);
    const id = response.data.id;
    return { id: id };
  } catch (error) {
    throw error;
  }
};

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
