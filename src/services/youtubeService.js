const axios = require("axios");
const Joi = require("joi");

const trackService = require("./trackService");
const artistService = require("./artistService");
const { youtubeUtils } = require("../utils/platformUtils");
const { platformTypes } = require("../config/type");

const schema = Joi.object().keys({
  platformIds: Joi.object().keys({
    google: Joi.string().required(),
  }),
});

const createPlaylistToPlatform = async (playlist, platformId, accessToken) => {
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
    mine: true,
    pageToken: "",
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

    params.pageToken = data.nextPageToken;
  } while (params.pageToken);

  return playlists;
};

//track.search
const getTrackIdFromPlatform = async (tracks, accessToken) => {
  const trackParams = {
    part: "id",
    q: "",
    type: "video",
    // topicId: "/m/04rlf",
    videoCategoryId: 10,
  };
  const options = {
    method: "GET",
    url: "https://www.googleapis.com/youtube/v3/search",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    trackParams,
  };

  const providerTrackIds = [];
  const cachedTrackIds = [];

  for (const track of tracks) {
    const artist = track.artist;
    const cachedTrack = await trackService.getTrackByTitleAndArtist(
      track.title,
      artist.platformId.local
    );

    cachedTrackIds.push(cachedTrack.id);
    if (
      Object.prototype.hasOwnProperty.call(
        cachedTrack.platformIds,
        platformTypes.SPOTIFY
      )
    ) {
      console.log("cached");
      platformTrackId = cachedTrack.platformIds.google;
    } else {
      console.log("not cached");

      const query = `${artist.name} ${track.title}`;
      trackParams.q = query;

      const response = await axios(options);
      const items = response.data.items;

      if (items.length !== 0) {
        providerTrackId = item[0].id.videoId;
      }
    }

    providerTrackIds.push(providerTrackId);
  }

  return { platform: platformTrackIds, local: cachedTrackIds };
};

//track.getId
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

    params.pageToken = data.nextPageToken;
  } while (params.pageToken);

  return trackIds;
};

//track.getInfo
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

    params.pageToken = data.nextPageToken;
  } while (params.pageToken);

  return tracks;
};

//getItemInfoFromPlatform 반복함수
//한번에 최대 50개의 트랙정보를 가져올 수 있음
const iterateGetItemInfo = async (trackIds, accessToken) => {
  let tracks = [];
  for (const trackId of splitArray(trackIds, 50)) {
    const track = await getItemInfoFromPlatform(trackId, accessToken);
    tracks.push(track.trackInfos);
  }

  if (tracks.length !== 0) {
    tracks = tracks.reduce((prev, current) => {
      return prev.concat(current);
    });
  }

  return tracks;
};

module.exports = {
  createPlaylistToPlatform,
  insertTrackToPlatform,
  getPlaylistFromPlatform,
  getTrackIdFromPlatform,
  getItemIdFromPlatform,
  getItemInfoFromPlatform,
  iterateGetItemInfo,
};
