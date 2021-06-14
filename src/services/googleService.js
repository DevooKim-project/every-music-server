const axios = require("axios");
const qs = require("qs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const trackService = require("./trackService");
const artistService = require("./artistService");
const tokenService = require("./tokenService");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const { youtubeUtils } = require("../utils/platformUtils");
const { platformTypes } = require("../config/type");

const getPlatformToken = async ({ code, redirectUri }) => {
  const data = {
    code,
    client_id: config.token.googleId,
    client_secret: config.token.googleSecret,
    redirect_uri: `${redirectUri}`,
    grant_type: "authorization_code",
  };

  try {
    const response = await axios({
      method: "POST",
      url: "https://oauth2.googleapis.com/token",
      data: qs.stringify(data),
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data.error;
      throw new ApiError(code, message);
    } else {
      throw new Error(error);
    }
  }
};

const getProfile = (idToken) => {
  return jwt.decode(idToken);
};

const refreshAccessToken = async (refreshToken) => {
  const data = {
    client_id: config.token.googleId,
    client_secret: config.token.googleSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };

  try {
    const response = await axios({
      method: "POST",
      url: "https://oauth2.googleapis.com/token",
      data: qs.stringify(data),
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data.error;
      throw new ApiError(code, message);
    } else {
      throw new Error(error);
    }
  }
};

const revoke = async (userId) => {
  try {
    const token = await tokenService.getPlatformTokenByUserId(userId, platformTypes.GOOGLE);

    const params = { token: token.refreshToken };
    const options = {
      method: "POST",
      url: "https://oauth2.googleapis.com/revoke",
      params,
    };

    await axios(options);
    return;
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data.error;
      throw new ApiError(code, message);
    } else {
      throw new Error(error);
    }
  }
};
//playlist
const createPlaylistToPlatform = async (playlist, accessToken) => {
  const params = {
    part: "snippet",
  };
  const data = {
    snippet: {
      title: playlist.title,
      description: "This created with URL // " + playlist.description,
    },
  };
  const options = {
    method: "POST",
    url: "https://www.googleapis.com/youtube/v3/playlists",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    params,
    data,
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    throw new ApiError(error.response.status, error.response.message);
  }
};

const insertTrackToPlatform = async (playlistId, trackIds, accessToken) => {
  const params = {
    part: "snippet",
  };
  const data = {
    snippet: {
      playlistId: playlistId,
      resourceId: {
        kind: "youtube#video",
        videoId: "",
      },
    },
  };
  const options = {
    method: "POST",
    url: "https://www.googleapis.com/youtube/v3/playlistItems",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    params,
    data,
  };

  try {
    //one by one
    for (const trackId of trackIds) {
      data.snippet.resourceId.videoId = trackId;
      await axios(options);
    }
    return;
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data.error;
      throw new ApiError(code, message);
    } else {
      throw new Error(error);
    }
  }
};

const getPlaylistFromPlatform = async (accessToken) => {
  const params = {
    part: "snippet",
    maxResults: 50,
    pageToken: "",
    mine: true,
  };
  const options = {
    method: "GET",
    url: "https://www.googleapis.com/youtube/v3/playlists",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    params,
  };

  try {
    const playlists = [];
    do {
      const response = await axios(options);
      const { data } = response;

      data.items.forEach((item) => {
        playlists.push(youtubeUtils.setPlaylist(item));
      });

      Object.assign(params, { pageToken: data.nextPageToken });
    } while (params.pageToken);

    return playlists;
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data.error;
      throw new ApiError(code, message);
    } else {
      throw new Error(error);
    }
  }
};

//track.search
const getTrackIdFromPlatform = async (tracks, accessToken) => {
  const params = {
    part: "id",
    q: "",
    type: "video",
    videoLicense: "youtube",
    videoCategoryId: 10,
  };
  const options = {
    method: "GET",
    url: "https://www.googleapis.com/youtube/v3/search",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    params,
  };

  try {
    const platformTrackIds = [];
    const cachedTrackIds = [];

    for (const track of tracks) {
      let platformTrackId;
      let cachedTrack;
      if (track.hasOwnProperty("artist")) {
        cachedTrack = await trackService.getTrackByTitleAndArtist(track.title, track.artist);
        cachedTrackIds.push(cachedTrack.id);
        const { platformIds } = cachedTrack;
        const { google } = pick(platformIds, ["google"]);
        platformTrackId = google;
      }
      //not Cached
      if (!platformTrackId) {
        const query = `${track.artistName} - Topic ${track.title}`;
        Object.assign(params, { q: query });
        const response = await axios(options);
        const items = response.data.items;
        if (items.length) {
          platformTrackId = items[0].id.videoId;
          Object.assign(cachedTrack.platformIds, { google: platformTrackId });
          await cachedTrack.save();
        }
      }
      if (platformTrackId) {
        platformTrackIds.push(platformTrackId);
      }
    }

    return { platform: platformTrackIds, local: cachedTrackIds };
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data.error;
      throw new ApiError(code, message);
    } else {
      throw new Error(error);
    }
  }
};

const getItemFromPlatform = async (playlistId, accessToken) => {
  const params = {
    part: "snippet",
    maxResults: 50,
    playlistId: playlistId,
  };
  const options = {
    method: "GET",
    url: "https://www.googleapis.com/youtube/v3/playlistItems",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    params,
  };

  try {
    const tracks = [];
    do {
      const response = await axios(options);
      const { data } = response;
      for (item of data.items) {
        let { track, artist } = youtubeUtils.setTrack(item);

        artist = await artistService.caching(artist, platformTypes.GOOGLE);
        track = await trackService.caching(track, artist, platformTypes.GOOGLE);
        artist = artist.toJSON();
        track = track.toJSON();

        Object.assign(track.platformIds, {
          local: track.id,
        });

        tracks.push(track);
      }

      Object.assign(params, { pageToken: data.nextPageToken });
    } while (params.pageToken);

    return tracks;
  } catch (error) {
    if (error.response) {
      const { code, message } = error.response.data.error;
      throw new ApiError(code, message);
    } else {
      throw new Error(error);
    }
  }
};

module.exports = {
  getPlatformToken,
  getProfile,
  refreshAccessToken,
  revoke,
  createPlaylistToPlatform,
  insertTrackToPlatform,
  getPlaylistFromPlatform,
  getItemFromPlatform,
  getTrackIdFromPlatform,
};
