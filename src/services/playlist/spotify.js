const axios = require("axios");
const { cacheService } = require("../database");

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

const getTrack = async (id, token) => {
  try {
    const options = {
      method: "GET",
      url: `https://api.spotify.com/v1/playlists/${id}/tracks`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const tracks = [];
    do {
      const response = await axios(options);
      const { data } = response;
      data.items.forEach((item) => {
        const track = parseTrackItem(item.track);
        tracks.push(track);

        //insert data to redis
        const key = `artist-${track.artists[0].name}-spotify`;
        const value = track.artists[0].id;

        cacheService.addArtist(track.artists[0], "spotify");
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
    thumbnail: playList.images[0],
    description: playList.description,
    owner: {
      name: playList.owner.display_name,
      id: playList.owner.id,
    },
  };
};

const parseTrackItem = (track) => {
  const artists = [];
  track.artists.forEach((artist) => {
    artists.push({
      name: artist.name,
      id: artist.id,
    });
  });
  return {
    id: track.id,
    title: track.name,
    artists: artists,
    album: {
      name: track.album.name,
      id: track.album.id,
    },
    duration_ms: track.duration_ms,
    track_number: track.track_number,
    thumbnail: track.album.images[0],
  };
};

module.exports = { searchList, getTrack };
