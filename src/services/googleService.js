const axios = require("axios");
const qs = require("qs");
const jwt = require("jsonwebtoken");

const trackService = require("./trackService");
const artistService = require("./artistService");
const tokenService = require("./tokenService");
const splitArray = require("../utils/splitArray");
const pick = require("../utils/pick");
const { youtubeUtils } = require("../utils/platformUtils");
const { platformTypes } = require("../config/type");
const { googleParams } = require("../config/oAuthParam");

const getOAuthUrl = (type) => {
  const oAuthParam = googleParams(type);
  const { scopes, redirectUri } = oAuthParam;
  const url = "https://accounts.google.com/o/oauth2/v2/auth";

  const params = {
    client_id: process.env.GOOGLE_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(" "),
  };

  const oAuthUri = `${url}?${qs.stringify(params)}`;
  return oAuthUri;
};

const getPlatformToken = async ({ code, type }) => {
  const redirectUri = type === "login" ? process.env.REDIRECT_LOGIN : process.env.REDIRECT_TOKEN;
  const data = {
    code,
    client_id: process.env.GOOGLE_ID,
    client_secret: process.env.GOOGLE_SECRET,
    redirect_uri: `${redirectUri}/?platform=google&type=${type}`,
    grant_type: "authorization_code",
  };

  const response = await axios({
    method: "POST",
    url: "https://oauth2.googleapis.com/token",
    data: qs.stringify(data),
  });

  console.log(response.data);
  return response.data;
};

const getProfile = (idToken) => {
  return jwt.decode(idToken);
};

const revoke = async (userId) => {
  const token = await tokenService.findPlatformTokenById(userId, platformTypes.GOOGLE);

  const params = { token: token.refreshToken };
  const options = {
    method: "POST",
    url: "https://oauth2.googleapis.com/revoke",
    params,
  };

  await axios(options);
};

//playlist
const createPlaylistToPlatform = async (playlist, accessToken) => {
  const params = {
    part: "snippet",
  };
  const data = {
    snippet: {
      title: playlist.title,
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

  const response = await axios(options);

  return response.data;
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

  //one by one
  for (const trackId of trackIds) {
    data.snippet.resourceId.videoId = trackId;
    await axios(options);
  }

  return;
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
};

//track.search
const getTrackIdFromPlatform = async (tracks, accessToken) => {
  const params = {
    part: "id",
    q: "",
    type: "video",
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

  const platformTrackIds = [];
  const cachedTrackIds = [];

  for (const track of tracks) {
    let platformTrackId;
    const artist = track.artist;
    const cachedTrack = await trackService.getTrackByTitleAndArtist(track.title, artist.platformIds.local);

    cachedTrackIds.push(cachedTrack.id);

    const { platformIds } = cachedTrack;
    const { google } = pick(platformIds, ["google"]);

    if (google) {
      //캐싱되어 있음
      console.log("cached");
      platformTrackId = cachedTrack.platformIds.google;
    } else {
      console.log("not cached");

      const query = `${artist.name} ${track.title}`;
      Object.assign(params, { q: query });
      const response = await axios(options);
      const items = response.data.items;

      if (items.length) {
        platformTrackId = items[0].id.videoId;
      }
    }

    platformTrackIds.push(platformTrackId);
  }

  return { platform: platformTrackIds, local: cachedTrackIds };
};

const getItemIdFromPlatform = async (playlistId, accessToken) => {
  const params = {
    part: "contentDetails",
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

  const trackIds = [];
  do {
    const response = await axios(options);
    const { data } = response;

    data.items.forEach((item) => {
      let trackId = item.contentDetails.videoId;
      trackIds.push(trackId);
    });

    Object.assign(params, { pageToken: data.nextPageToken });
  } while (params.pageToken);

  return trackIds;
};

const getItemInfoFromPlatform = async (trackId, accessToken) => {
  const params = {
    part: "snippet",
    id: trackId.toString(),
  };
  const options = {
    method: "GET",
    url: "https://www.googleapis.com/youtube/v3/videos",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    params,
  };

  const tracks = [];
  do {
    const response = await axios(options);
    const { data } = response;
    for (item of data.items) {
      let trackBody = youtubeUtils.setTrack(item);

      let artist = await artistService.caching(trackBody.artist, platformTypes.GOOGLE);
      let track = await trackService.caching(trackBody, artist, platformTypes.GOOGLE);
      artist = artist.toJSON();
      track = track.toJSON();

      Object.assign(trackBody.platformIds, track.platformIds, {
        local: track.id,
      });
      Object.assign(trackBody.artist.platformIds, artist.platformIds, {
        local: artist.id,
      });
      tracks.push(trackBody);
    }

    Object.assign(params, { pageToken: data.nextPageToken });
  } while (params.pageToken);

  return tracks;
};

//getItemInfoFromPlatform 반복함수
//한번에 최대 50개의 트랙정보를 가져올 수 있음
const iterateGetItemInfo = async (trackIds, accessToken) => {
  let tracks = [];
  for (const trackId of splitArray(trackIds, 50)) {
    tracks.push(await getItemInfoFromPlatform(trackId, accessToken));
  }

  if (tracks.length !== 0) {
    tracks = tracks.reduce((prev, current) => {
      return prev.concat(current);
    });
  }

  return tracks;
};

module.exports = {
  getOAuthUrl,
  getPlatformToken,
  getProfile,
  revoke,
  createPlaylistToPlatform,
  insertTrackToPlatform,
  getPlaylistFromPlatform,
  getTrackIdFromPlatform,
  getItemIdFromPlatform,
  getItemInfoFromPlatform,
  iterateGetItemInfo,
};
