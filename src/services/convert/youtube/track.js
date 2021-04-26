const axios = require("axios");

const { trackService } = require("../../database");
const { uploadArtistTrack } = require("../common");

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

    const provider_trackids = [];
    const local_trackids = [];
    for (const t of tracks) {
      const artist = t.artist;
      let track = await trackService.findTrack(t.title, artist.ids.local);

      const local_trackid = track.id;
      local_trackids.push(local_trackid);
      let provider_trackid = "";

      if (track.providerid.google) {
        console.log("cached");
        provider_trackid = track.providerid.google;
      } else {
        console.log("not Cache");

        const query = `${artist.name} ${t.title}"`;
        trackParams.q = query;
        options.params = trackParams;
        const response = await axios(options);
        const items = response.data.items;

        if (items.length !== 0) {
          provider_trackid = items[0].id.videoId;
        } else {
          console.log("not found");
        }
      }
      provider_trackids.push(provider_trackid);
    }

    return { provider: provider_trackids, local: local_trackids };
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

    const trackids = [];
    do {
      const response = await axios(options);
      const { data } = response;
      data.items.forEach((item) => {
        let trackid = parseTrackItem(item);
        trackids.push(trackid);
      });

      params.pageToken = data.nextPageToken;
    } while (params.pageToken);

    return { trackids };
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
      for (item of data.items) {
        let track = parseTrackInfo(item);
        //db 저장
        track = await uploadArtistTrack(track, "youtube");
        trackInfos.push(track);
      }

      params.pageToken = data.nextPageToken;
    } while (params.pageToken);

    return { trackInfos };
  } catch (error) {
    throw error;
  }
};

exports.insert = async (playlistid, trackids, token) => {
  try {
    const params = {
      part: "snippet",
    };
    const data = {
      snippet: {
        playlistId: playlistid,
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

    for (const trackid of trackids) {
      data.snippet.resourceId.videoId = trackid;
      const response = await axios(options);
      console.log("insert: ", response.data.snippet.title);
    }

    return;
  } catch (error) {
    throw error;
  }
};

const parseTrackItem = (trackid) => {
  return trackid.contentDetails.videoId;
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
