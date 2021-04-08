const { artistService, trackService, playlistService } = require("../database");
exports.storeArtistTrack = async (trackData, provider) => {
  try {
    //1. artist 확인 후 저장
    //1-1. 있는데 providerId가 없으면 업데이트
    //2. artist local Id 객체에 저장
    //3. track title과 artist providerId로 확인 후 저장
    //3-1. 있는데 providerId가 없으며 업데이트
    //4. 객체에 track local Id 객체에 저장

    //Aritst
    let artist = await artistService.findArtist(trackData.artist.name);
    let artistId = "";

    if (artist) {
      if (!hasProviderId(artist.provider_id, provider)) {
        const provider_id = {
          ...artist.provider_id,
          ...trackData.artist.ids,
        };
        artist = artistService.updateArtist(trackData.artist.name, provider_id);
      }
    } else {
      console.log("store artist");
      artist = await artistService.storeArtist(trackData.artist);
    }
    artistId = {
      local: artist._id,
      ...artist.provider_id,
    };

    //Track
    let track = await trackService.findTrack(trackData.title, artistId.local);
    let trackId = "";

    if (track) {
      if (!hasProviderId(track.provider_id, provider)) {
        const provider_id = {
          ...track.provider_id,
          ...trackData.ids,
        };
        artist = trackService.updateTrack(trackData.title, provider_id);
      }
    } else {
      console.log("store track");
      track = await trackService.storeTrack(trackData, artistId.local);
    }
    trackId = {
      local: track._id,
      ...track.provider_id,
    };

    trackData.artist.ids = artistId;
    trackData.ids = trackId;

    return trackData;
  } catch (error) {
    throw error;
  }
};

exports.storePlaylist = async (data) => {
  try {
    await playlistService.storePlaylist(data);
    return;
  } catch (error) {
    throw error;
  }
};

exports.splitArray = (array, offset) => {
  let start = 0;
  let end = offset;
  const result = [];
  while (start < array.length) {
    result.push(array.slice(start, end));
    start = end;
    end += offset;
  }
  return result;
};

const hasProviderId = (provider_id, provider) => {
  switch (provider) {
    case "youtube":
      if (provider_id.youtube) return true;
      else return false;
    case "spotify":
      if (provider_id.spotify) return true;
      else return false;
    default:
      throw new Error("checkProviderId type error");
  }
};
