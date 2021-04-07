const axios = require("axios");

const { cacheService, trackService } = require("../../database");
const { storeArtistTrack } = require("../common");

exports.search = async (tracks, token) => {
  try {
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
        authorization: `Bearer ${token}`,
      },
    };
    const track_ids = [];
    for (const t of tracks) {
      const artist = t.artist;
      let track = await trackService.findTrack(t.title, artist.ids.local);
      let trackId = "";
      if (track.provider_id.youtube) {
        console.log("cached");
        trackId = track.provider_id.youtube;
      } else {
        console.log("not Cache");

        const query = `${artist.name} ${t.title}"`;
        trackParams.q = query;
        options.params = trackParams;
        const response = await axios(options);
        const items = response.data.items;

        if (items.length !== 0) {
          trackId = items[0].id.videoId;
        } else {
          console.log("not found");
        }
      }
      track_ids.push(trackId);
    }

    return track_ids;
  } catch (error) {
    throw error;
  }
};
exports.getId = async (id, token) => {
  try {
    const params = {
      part: "contentDetails",
      maxResults: 50,
      playlistId: id,
    };
    const options = {
      method: "GET",
      url: "https://www.googleapis.com/youtube/v3/playlistItems",
      headers: {
        authorization: `Bearer ${token}`,
      },
      params,
    };

    const track_ids = [];
    do {
      const response = await axios(options);
      const { data } = response;
      data.items.forEach((item) => {
        let trackId = parseTrackItem(item);
        track_ids.push(trackId);
      });

      params.pageToken = data.nextPageToken;
    } while (params.pageToken);

    return { track_ids };
  } catch (error) {
    // console.error(error);
    throw error;
  }
};

exports.getInfo = async (id, token) => {
  try {
    const params = {
      part: "snippet",
      id: id.toString(),
    };
    const options = {
      method: "GET",
      url: "https://www.googleapis.com/youtube/v3/videos",
      headers: {
        authorization: `Bearer ${token}`,
      },
      params,
    };

    const trackInfos = [];
    do {
      const response = await axios(options);
      const { data } = response;
      // data.items.forEach((item) => {
      for (item of data.items) {
        let track = parseTrackInfo(item);
        //db 저장
        track = await storeArtistTrack(track, "youtube");
        trackInfos.push(track);

        //insert data to redis
        // cacheService.addArtist(track.artists[0], "google");
        // cacheService.addTrack(track, "google");
      }

      params.pageToken = data.nextPageToken;
    } while (params.pageToken);

    return { trackInfos };
  } catch (error) {
    throw error;
  }
};

exports.insert = async (playlistId, track_ids, token) => {
  try {
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
        authorization: `Bearer ${token}`,
      },
      params,
      data,
    };

    for (const trackId of track_ids) {
      data.snippet.resourceId.videoId = trackId;
      const response = await axios(options);
      console.log("insert: ", response.data.snippet.title);
    }

    return;
  } catch (error) {
    throw error;
  }
};

const parseTrackItem = (trackId) => {
  return trackId.contentDetails.videoId;
};

const parseTrackInfo = (track) => {
  const artist = {
    name: track.snippet.channelTitle.replace(/ - Topic/, ""),
    ids: {
      youtube: track.snippet.channelId,
    },
  };

  return {
    title: track.snippet.title,
    ids: {
      youtube: track.id,
    },
    artist: artist,
    thumbnail: track.snippet.thumbnails.default.url,
  };
};
