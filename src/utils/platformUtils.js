const { platformTypes } = require("../config/type");

const youtubeUtils = {
  setPlaylist: (playlist) => {
    return {
      platformId: playlist.id,
      title: playlist.snippet.title,
      thumbnail: playlist.snippet.thumbnails.default.url,
      description: playlist.snippet.description,
      owner: {
        name: playlist.snippet.channelTitle,
        platformId: playlist.snippet.channelId,
      },
      platform: platformTypes.YOUTUBE,
    };
  },
  setTrack: (track) => {
    return {
      title: track.snippet.title,
      platformIds: {
        google: track.id,
      },
      artist: {
        name: track.snippet.channelTitle.replace(/ - Topic/, ""),
        platformIds: {
          google: track.snippet.channelId,
        },
      },
      thumbnail: track.snippet.thumbnails.default.url,
    };
  },
};

const spotifyUtils = {
  setPlaylist: (playlist) => {
    return {
      platformId: playlist.id,
      title: playlist.name,
      thumbnail: playlist.images[0].url,
      description: playlist.description,
      owner: {
        name: playlist.owner.display_name,
        platformId: playlist.owner.id,
      },
      platform: platformTypes.SPOTIFY,
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
