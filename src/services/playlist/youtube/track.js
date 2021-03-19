const axios = require("axios");

const { cacheService } = require("../../database");

const search = async (tracks, token) => {
  try {
    const artistParams = {
      part: "id",
      q: "",
      type: "channel",
      // topicId: "/m/04rlf",
      videoId: 10,
    };
    const trackParams = {
      part: "id",
      q: "",
      channelId: "",
      type: "video",
      // topicId: "/m/04rlf",
      videoId: 10,
    };
    const options = {
      method: "GET",
      url: "https://www.googleapis.com/youtube/v3/search",
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const trackIds = [];
    for (const track of tracks) {
      //아티스트 이름으로 아티스트id 가져온다.
      //redis에서 검색
      const artist = track.artists[0];
      let artistIds = cacheService.getArtist(artist, "spotify"); //from google to spotify

      //아티스트 request
      if (!artistIds) {
        artistParams.q = `${artist.name} - Topic`;

        options.params = artistParams;
        const response = await axios(options);
        const items = response.data.items;
        artistIds = [items[0].id.channelId];

        //request 후 redis에 저장
        if (artistIds.length !== 0) {
          cacheService.addArtist({
            name: artist.name,
            id: artistIds,
          });
        }
      }

      //캐시에 같은 이름의 아티스트가 있는 경우
      //아티스트id + 트랙명으로 트랙id 가져온다.
      for (const id of artistIds) {
        trackParams.q = track.title;
        trackParams.channelId = id;
        options.params = trackParams;

        const response = await axios(options);
        const items = response.data.items;
        trackId = items[0].id.videoId;

        if (trackId) {
          trackIds.push(trackId);
          break;
        }
      }
    }

    return trackIds;
  } catch (error) {
    throw error;
  }
};

const getId = async (id, token) => {
  try {
    const params = {
      part: "contentDetails",
      maxResults: 5,
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

    const trackIds = [];
    do {
      const response = await axios(options);
      const { data } = response;
      data.items.forEach((item) => {
        trackIds.push(parseTrackItem(item));
      });

      params.pageToken = data.nextPageToken;
    } while (params.pageToken);

    return { trackIds };
  } catch (error) {
    // console.error(error);
    throw error;
  }
};

const getInfo = async (id, token) => {
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
      data.items.forEach((item) => {
        const track = parseTrackInfo(item);
        trackInfos.push(track);

        //insert data to redis
        cacheService.addArtist(track.artists[0], "google");
      });

      params.pageToken = data.nextPageToken;
    } while (params.pageToken);

    return { trackInfos };
  } catch (error) {
    throw error;
  }
};

const create = async (id, tracks, token) => {
  try {
    const params = {
      part: "snippet",
    };
    const data = {
      snippet: {
        playlistId: id,
        resourceId: {
          kind: "youtube#video",
          videoId: "",
        },
      },
    };
    const options = {
      method: "POST",
      url: "https://www.googleapis.com/youtube/v3/playlists",
      headers: {
        authorization: `Bearer ${token}`,
      },
      params,
      data,
    };

    const newTracks = [];
    for (const track of tracks) {
      data.snippet.resourceId.videoId = track.id;
      const response = await axios(options);
      newTracks.push(response.data);
    }

    return newTracks;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { search, getId, getInfo, create };

//not exports
const parseTrackItem = (trackId) => {
  return trackId.contentDetails.videoId;
};

const parseTrackInfo = (track) => {
  const artist = {
    name: track.snippet.channelTitle.replace(/ - Topic/, ""),
    id: track.snippet.channelId,
  };
  const album = {
    // name: track.snippet.tags[1],
    // id: "",
  };

  return {
    id: track.id,
    title: track.snippet.title,
    artists: [artist],
    album: album,
    thumbnail: track.snippet.thumbnails.default,
  };
};
