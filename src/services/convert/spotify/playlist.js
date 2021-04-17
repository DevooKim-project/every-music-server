const axios = require("axios");

exports.search = async (access_token) => {
  try {
    const params = {
      limit: 50,
    };
    const options = {
      method: "GET",
      url: "https://api.spotify.com/v1/me/playlists",
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

      options.url = data.next;
    } while (options.url);

    return { playlists };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

exports.create = async (playlist, userid, access_token) => {
  try {
    const data = {
      name: "",
      description: "",
      public: false,
    };
    const options = {
      method: "POST",
      url: `https://api.spotify.com/v1/users/${userid}/playlists`,
      headers: {
        authorization: `Bearer ${access_token}`,
      },
      data,
    };

    data.name = playlist.title;
    const response = await axios(options);
    const id = response.data.id;
    return { id: id };
  } catch (error) {
    throw error;
  }
};

//not exports
const parsePlaylist = (playlist) => {
  return {
    id: playlist.id,
    title: playlist.name,
    thumbnail: playlist.images[0].url,
    description: playlist.description,
    owner: {
      name: playlist.owner.display_name,
      id: playlist.owner.id,
    },
    provider: "spotify",
  };
};
