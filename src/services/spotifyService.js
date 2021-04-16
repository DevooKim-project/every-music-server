const axios = require("axios");
const qs = require("qs");
const { Base64 } = require("js-base64");
const Joi = require("joi");

const { spotifyParams } = require("../config/oAuthParam");
const trackService = require("./trackService");
const artistService = require("./artistService");
const { spotifyUtils } = require("../utils/platformUtils");

const schema = Joi.object().keys({
  ids: Joi.object().keys({
    spotify: Joi.string().required(),
  }),
});

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

const getPlaylistsFromPlatform = async (accessToken) => {
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
      playlists.push(spotifyUtils.parsePlaylist(item));
    });

    options.url = data.next;
  } while (options.url);

  return playlists;
};

const getTracksFromPlatform = async (playlistId, accessToken) => {
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
    for (const item of data.items) {
      let track = spotifyUtils.setTrack(item.track);
      //db 저장
      // track = await trackService.uploadArtistTrack(
      //   track,
      //   platformTypes.SPOTIFY
      // );
      const artist = artistService.caching(track.artist, schema);
      track = trackService.caching(track, artist, schema);

      console.log("artist: ", artist);
      console.log("track: ", track);
      tracks.push(track);
    }
    options.url = data.next;
  } while (options.url);

  return tracks;
};

module.exports = {
  getOAuthUrl,
  getPlatformToken,
  getProfile,
  getPlaylistsFromPlatform,
  getTracksFromPlatform,
};
