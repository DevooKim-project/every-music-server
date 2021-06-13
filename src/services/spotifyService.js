const axios = require("axios");
const qs = require("qs");
const { Base64 } = require("js-base64");
const config = require("../config/config");
const trackService = require("./trackService");
const artistService = require("./artistService");
const { spotifyUtils } = require("../utils/platformUtils");
const { platformTypes } = require("../config/type");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");

//OAuth Service
const getPlatformToken = async ({ code, redirectUri }) => {
  const data = {
    code,
    grant_type: "authorization_code",
    redirect_uri: `${redirectUri}`,
  };

  const key = Base64.encode(`${config.token.spotifyId}:${config.token.spotifySecret}`);

  const response = await axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      authorization: `Basic ${key}`,
    },
    data: qs.stringify(data),
  });

  return response.data;
};

const getProfile = async (accessToken) => {
  const response = await axios({
    method: "GET",
    url: "https://api.spotify.com/v1/me",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

const refreshAccessToken = async (refreshToken) => {
  const key = Base64.encode(`${config.token.spotifyId}:${config.token.spotifySecret}`);
  const data = {
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };
  const response = await axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      authorization: `Basic ${key}`,
    },
    data: qs.stringify(data),
  });
  return response.data;
};

//Playlist Service
const createPlaylistToPlatform = async (playlist, platformId, accessToken) => {
  const data = {
    name: playlist.title,
    description: "This created with URL // " + playlist.description,
    public: false,
  };
  const options = {
    method: "POST",
    url: `https://api.spotify.com/v1/users/${platformId}/playlists`,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    data,
  };

  const response = await axios(options);

  return response.data;
};

const insertTrackToPlatform = async (playlistId, trackId, accessToken) => {
  const data = {
    uris: trackId,
  };
  const options = {
    method: "POST",
    url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    data,
  };

  await axios(options);
  return;
};

const getPlaylistFromPlatform = async (accessToken) => {
  const params = {
    limit: 50,
  };
  const options = {
    method: "GET",
    url: "https://api.spotify.com/v1/me/playlists",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    params,
  };

  const playlists = [];
  do {
    const response = await axios(options);
    const { data } = response;

    data.items.forEach((item) => {
      playlists.push(spotifyUtils.setPlaylist(item));
    });

    options.url = data.next;
  } while (options.url);

  return playlists;
};

const getTrackIdFromPlatform = async (tracks, accessToken) => {
  const params = {
    q: "",
    type: "track",
    limit: 1,
  };
  const options = {
    method: "GET",
    url: "https://api.spotify.com/v1/search",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    params,
  };

  const platformTrackIds = [];
  const cachedTrackIds = [];

  for (const track of tracks) {
    let platformTrackId;
    let cachedTrack;
    if (track.hasOwnProperty("artist")) {
      cachedTrack = await trackService.getTrackByTitleAndArtist(track.title, track.artist);
      cachedTrackIds.push(cachedTrack.id);
      const { platformIds } = cachedTrack;
      const { spotify } = pick(platformIds, ["spotify"]);
      platformTrackId = spotify;
    }

    //not Cached
    if (!platformTrackId) {
      const query = `${track.title} artist: "${track.artistName}"`;
      params.q = query;

      const response = await axios(options);
      const items = response.data.tracks.items;

      if (items.length) {
        platformTrackId = items[0].id;
        Object.assign(cachedTrack.platformIds, { spotify: platformTrackId });
        await cachedTrack.save();
      }
    }
    if (platformTrackId) {
      platformTrackIds.push(`spotify:track:${platformTrackId}`);
    }
  }

  return { platform: platformTrackIds, local: cachedTrackIds };
};

const getItemFromPlatform = async (playlistId, accessToken) => {
  const options = {
    method: "GET",
    url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  };

  const tracks = [];
  do {
    const response = await axios(options);
    const { data } = response;
    for (const item of data.items) {
      let { track, artist } = spotifyUtils.setTrack(item.track);

      artist = await artistService.caching(artist, platformTypes.SPOTIFY);
      track = await trackService.caching(track, artist, platformTypes.SPOTIFY);
      artist = artist.toJSON();
      track = track.toJSON();

      Object.assign(track.platformIds, {
        local: track.id,
      });

      tracks.push(track);
    }
    options.url = data.next;
  } while (options.url);

  return tracks;
};

module.exports = {
  getPlatformToken,
  getProfile,
  refreshAccessToken,
  createPlaylistToPlatform,
  insertTrackToPlatform,
  getPlaylistFromPlatform,
  getTrackIdFromPlatform,
  getItemFromPlatform,
};
