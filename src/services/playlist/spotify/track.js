const axios = require("axios");

const { cacheService } = require("../../database");

const get = async (id, token) => {
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

module.exports = { get };

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
