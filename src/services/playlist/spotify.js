const axios = require("axios");

const searchList = async (token) => {
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
    };

    const playLists = [];
    do {
      const response = await axios(options, params);
      const { data } = response;

      console.log(data.items);
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

const getTrack = async (id, token) => {
  try {
    const options = {
      method: "GET",
      url: `https://api.spotify.com/v1/playlists/${id}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const tracks = [];
    do {
      const response = await axios(options);
      const { data } = response;
      data.tracks.items.forEach((item) => {
        console.log("item: ", item.track);
        tracks.push(parseTrackItem(item.track));
      });
      options.url = data.next;
    } while (options.url);

    return { tracks };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const parsePlayList = (playList) => {
  return {
    id: playList.id,
    title: playList.name,
    thumbnail: playList.images,
    description: playList.description,
    owner: {
      name: playList.owner.name,
      id: playList.owner.id,
    },
  };
};

const parseTrackItem = (track) => {
  return {
    id: track.id,
    title: track.name,
    artist: {
      name: track.artists.name,
      id: track.artists.id,
    },
    album: {
      name: track.album.name,
      id: track.album.id,
    },
    duration_ms: track.duration_ms,
    track_number: track.track_number,
  };
};

module.exports = { searchList, getTrack };
