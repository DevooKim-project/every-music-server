const axios = require("axios");
const qs = require("qs");
const { Base64 } = require("js-base64");
const Joi = require("joi");

const { spotifyParams } = require("../config/oAuthParam");
const trackService = require("./trackService");
const artistService = require("./artistService");
const { spotifyUtils } = require("../utils/platformUtils");
const { platformTypes } = require("../config/type");

const schema = Joi.object().keys({
  platformIds: Joi.object().keys({
    spotify: Joi.string().required(),
  }),
});

//OAuth Service
const getOAuthUrl = (type) => {
  const oAuthParam = spotifyParams(type);
  const { scopes, redirectUri } = oAuthParam;
  const url = "https://accounts.spotify.com/authorize";

  const params = {
    response_type: "code",
    client_id: process.env.SPOTIFY_ID,
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
  };

  const oAuthUri = `${url}?${qs.stringify(params)}`;
  return oAuthUri;
};

const getPlatformToken = async (code, type) => {
  const oAuthParam = spotifyParams(type);
  const { redirectUri } = oAuthParam;

  const data = {
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  };

  const key = Base64.encode(
    `${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`
  );

  const response = await axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      authorization: `Basic ${key}`,
    },
    data: qs.stringify(data),
  });

  console.log("response: ", response.data);

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
  console.log(response.data);
  return response.data;
};

//Playlist Service
const createPlaylistToPlatform = async (playlist, platformId, accessToken) => {
  const data = {
    name: playlist.title,
    description: "",
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
    //1. 아티스트 로컬 Id와 트랙 명으로 캐시에서 트랙 검색 (트랙과 아티스트는 모두 로컬id를 가지고 있음)
    //2. 트랙에 찾고자 하는 platform의 Id( platformId.{platform} )가 있는지 확인
    //3. 있는 경우 그대로 저장
    //4. 없는 경우 요청 보내고 저장

    let platformTrackId;
    const artist = track.artist;
    let cachedTrack = await trackService.getTrackByTitleAndArtist(
      track.title,
      artist.platformIds.local
    );

    cachedTrackIds.push(cachedTrack.id);
    if (
      Object.prototype.hasOwnProperty.call(
        cachedTrack.platformIds,
        platformTypes.SPOTIFY
      )
    ) {
      console.log("cached");
      platformTrackId = cachedTrack.platformIds.spotify;
    } else {
      console.log("not cached");
      const query = `${track.title} artist: "${artist.name}"`;
      params.q = query;

      const response = await axios(options);
      const items = response.data.tracks.items;
      if (items.length !== 0) {
        platformTrackId = items[0].id;
      } else {
        console.log("not found track");
      }
    }

    platformTrackIds.push(`spotify:track:${platformTrackId}`);
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
      const trackBody = spotifyUtils.setTrack(item.track);
      console.log("body: ", trackBody);
      //캐싱
      let artist = await artistService.caching(trackBody.artist, schema);
      let track = await trackService.caching(trackBody, artist, schema);
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
    options.url = data.next;
  } while (options.url);

  return tracks;
};

module.exports = {
  getOAuthUrl,
  getPlatformToken,
  getProfile,
  createPlaylistToPlatform,
  insertTrackToPlatform,
  getPlaylistFromPlatform,
  getTrackIdFromPlatform,
  getItemFromPlatform,
};
