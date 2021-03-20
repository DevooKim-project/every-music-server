const axios = require("axios");

const { cacheService } = require("../../database");

//캐싱이 적으면 할당량 초과됨
const search = async (tracks, token) => {
  try {
    const artistParams = {
      part: "id",
      q: "",
      type: "channel",
      // topicId: "/m/04rlf",
    };
    const trackParams = {
      part: "id",
      q: "",
      channelId: "",
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

    const trackIds = [];
    for (const track of tracks) {
      //아티스트 이름으로 아티스트id 가져온다.
      //redis에서 검색
      const artist = track.artists[0];
      let artistIds = cacheService.getArtist(artist, "spotify"); //from google to spotify

      console.log("getArtist - cache: ", artistIds);
      //아티스트 request
      if (!artistIds) {
        artistParams.q = `${artist.name} - Topic`;
        options.params = artistParams;
        console.log("options: ", options);
        const response = await axios(options);
        const items = response.data.items;
        artistIds = [items[0].id.channelId];
        console.log("search-artist: ", artistIds);

        //request 후 redis에 저장
        if (artistIds.length !== 0) {
          cacheService.addArtist(
            {
              name: artist.name,
              id: artistIds,
            },
            "youtube"
          );
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
        console.log("search-track: ", trackId);
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

//아티스트ID로 정확도를 높이는 대신 아티스트 + 트랙명으로 검색하여 API사용량 낮춤
const searchLight = async (tracks, token) => {
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
    // console.log("tracks: ", tracks);

    const trackIds = [];
    for (const track of tracks) {
      console.log("track: ", track);
      const artist = track.artists[0];
      const artistName = `${artist.name}`;
      const trackTitle = track.title;
      trackParams.q = artistName + trackTitle;

      options.params = trackParams;

      const response = await axios(options);
      const items = response.data.items;
      if (items.length !== 0) {
        trackId = items[0].id.videoId;
        console.log("search-track: ", trackId);
        trackIds.push(trackId);
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

const create = async (playListId, trackIds, token) => {
  try {
    const params = {
      part: "snippet",
    };
    const data = {
      snippet: {
        playlistId: playListId,
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

    for (const trackId of trackIds) {
      data.snippet.resourceId.videoId = trackId;
      const response = await axios(options);
      // console.log("insert: ", response.data.items[0].id);
    }

    return;
  } catch (error) {
    throw error;
  }
};

module.exports = { search, searchLight, getId, getInfo, create };

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
