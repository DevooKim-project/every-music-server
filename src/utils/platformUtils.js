const youtubeUtils = {};

const spotifyUtils = {
  parsePlaylist: (playlist) => {
    return {
      platformId: playlist.id,
      title: playlist.name,
      thumbnail: playlist.images[0].url,
      description: playlist.description,
      owner: {
        name: playlist.owner.display_name,
        platformId: playlist.owner.id,
      },
      platform: "spotify",
    };
  },
  setTrack: (track) => {
    const artist = track.artists[0];
    return {
      title: track.name,
      platformIds: {
        spotify: track.id,
      },
      artist: {
        name: artist.name,
        platformIds: {
          spotify: artist.id,
        },
      },
      thumbnail: track.album.images[0].url,
    };
  },
};

module.exports = { youtubeUtils, spotifyUtils };
