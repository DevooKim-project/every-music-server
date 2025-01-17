const httpStatus = require("http-status");

const ApiError = require("../utils/ApiError");
const { platformTypes } = require("../config/type");
const {
  googleAuthorizationUrl,
  spotifyAuthorizationUrl,
  kakaoAuthorizationUrl,
} = require("../config/authorizationUrl");

const youtubeUtils = {
  setPlaylist: (playlist) => {
    return {
      platformId: playlist.id,
      title: playlist.snippet.title,
      thumbnail: playlist.snippet.thumbnails.standard
        ? playlist.snippet.thumbnails.standard.url
        : playlist.snippet.thumbnails.default.url,
      description: playlist.snippet.description,
      owner: {
        name: playlist.snippet.channelTitle,
        platformId: playlist.snippet.channelId,
      },
      platform: platformTypes.YOUTUBE,
    };
  },
  setTrack: (track) => {
    /*예시1
    track.snippet.title: All Time Low - Take Cover (Official Music Video)
    track.snippet.videoOwnerChannelTitle: Hopeless Records
    titleWithoutArtist = Take Cover (Official Music Video)
    title = Take Cover
    artistNameByTitle = All Time Low
    artistNameByChannel = Hopeless Records
    */
    /*
    예시2
    track.snippet.title: Take Cover | Take Cover (Official Music Video)
    track.snippet.videoOwnerChannelTitle: All Time Low - Topic
    titleWithoutArtist = Take Cover | Take Cover (Official Music Video)
    title = Take Cover
    artistNameByTitle = Take Cover | Take Cover (Official Music Video)
    artistNameByChannel = All Time Low
    */
    const titleWithoutArtist = track.snippet.title.replace(/^(.+(-\s?|:\s?))/, "");
    title = titleWithoutArtist.replace(/\s*((\(|\[).*(Official|video|Lyrics).*(\)|\]))$/gi, "");

    const artistNameByTitle = track.snippet.title.replace(/(\s?-|\s?:).*/, "");
    const artistNameByChannel = track.snippet.videoOwnerChannelTitle.replace(/ - Topic/, "");
    const artistName = titleWithoutArtist === artistNameByTitle ? artistNameByChannel : artistNameByTitle;
    return {
      track: {
        title: title,
        artistName: artistName,
        platformIds: {
          google: track.snippet.resourceId.videoId,
        },
        thumbnail: track.snippet.thumbnails.standard
          ? track.snippet.thumbnails.standard.url
          : track.snippet.thumbnails.default.url,
      },
      artist: {
        name: artistName,
        platformIds: {
          google: track.snippet.videoOwnerChannelId,
        },
      },
    };
  },
};

const spotifyUtils = {
  setPlaylist: (playlist) => {
    return {
      platformId: playlist.id,
      title: playlist.name,
      thumbnail: playlist.images[0] ? playlist.images[0].url : "",
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
      track: {
        title: track.name,
        artistName: artist.name,
        platformIds: {
          spotify: track.id,
        },
        thumbnail: track.album.images[0] ? track.album.images[0].url : "",
      },
      artist: {
        name: artist.name,
        platformIds: {
          spotify: artist.id,
        },
      },
    };
  },
};

const getAuthorizationUrl = (platform, { redirectUri }) => {
  switch (platform) {
    case platformTypes.GOOGLE:
      return googleAuthorizationUrl(redirectUri);
    case platformTypes.SPOTIFY:
      return spotifyAuthorizationUrl(redirectUri);
    case platformTypes.KAKAO:
      return kakaoAuthorizationUrl(redirectUri);
    default:
      throw new ApiError(httpStatus.NOT_FOUND, "Not found oAuth Platform");
  }
};

module.exports = { youtubeUtils, spotifyUtils, getAuthorizationUrl };
