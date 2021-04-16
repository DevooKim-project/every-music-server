const youtubeUtils = {};

const spotifyUtils = {
  parsePlaylist: (playlist) => {
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
  },
  setTrack: (track) => {
    return {
      title: track.name,
      ids: {
        spotify: track.id,
      },
      artist: {
        name: artist.name,
        ids: {
          spotify: artist.id,
        },
      },
      thumbnail: track.album.images[0].url,
    };
  },
};

module.exports = { youtubeUtils, spotifyUtils };
