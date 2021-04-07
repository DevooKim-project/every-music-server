const axios = require("axios");
const { storePlaylist } = require("../../database/playlist");

const search = async (token) => {
  try {
    const params = {
      limit: 50,
    };
    const options = {
      method: "GET",
      url: "https://api.spotify.com/v1/me/playlists",
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

      options.url = data.next;
    } while (options.url);

    return { playlists };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const create = async (playlist, user_id, token) => {
  try {
    const data = {
      name: "",
      description: "",
      public: false,
    };
    const options = {
      method: "POST",
      url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
      headers: {
        authorization: `Bearer ${token}`,
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

const store = async (playlist, track_ids, user_id) => {
  try {
    await storePlaylist(playlist, track_ids, user_id);
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
    title: playlist.name,
    thumbnail: playlist.images[0],
    description: playlist.description,
    owner: {
      name: playlist.owner.display_name,
      id: playlist.owner.id,
    },
    provider: "spotify",
  };
};
