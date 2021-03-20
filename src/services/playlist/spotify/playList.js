const axios = require("axios");

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

    const playLists = [];
    do {
      const response = await axios(options);
      const { data } = response;

      data.items.forEach((item) => {
        playLists.push(parsePlayList(item));
      });

      options.url = data.next;
    } while (options.url);

    return { playLists };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = { search };

//not exports
const parsePlayList = (playList) => {
  return {
    id: playList.id,
    title: playList.name,
    thumbnail: playList.images[0],
    description: playList.description,
    owner: {
      name: playList.owner.display_name,
      id: playList.owner.id,
    },
  };
};
