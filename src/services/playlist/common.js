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
      if (!hasProviderId(artist.providerId, provider)) {
        const providerId = {
          ...artist.providerId,
          ...trackData.artist.ids,
        };
        artist = artistService.updateArtist(trackData.artist.name, providerId);
      }
    } else {
      console.log("store artist");
      artist = await artistService.storeArtist(trackData.artist);
    }
    artistId = {
      local: artist._id,
      ...artist.providerId,
    };

    //Track
    let track = await trackService.findTrack(trackData.title, artistId.local);
    let trackId = "";

    if (track) {
      if (!hasProviderId(track.providerId, provider)) {
        const providerId = {
          ...track.providerId,
          ...trackData.ids,
        };
        artist = trackService.updateTrack(trackData.title, providerId);
      }
    } else {
      console.log("store track");
      track = await trackService.storeTrack(trackData, artistId.local);
    }
    trackId = {
      local: track._id,
      ...track.providerId,
    };

    trackData.artist.ids = artistId;
    trackData.ids = trackId;

    return trackData;
  } catch (error) {
    throw error;
  }
};

exports.storePlaylist = async (playlist, trackIds, userId) => {
  try {
    await playlistService(playlist, trackIds, userId);
    return;
  } catch (error) {
    throw error;
  }
};

const hasProviderId = (providerId, provider) => {
  switch (provider) {
    case "youtube":
      if (providerId.youtube) return true;
      else return false;
    case "spotify":
      if (providerId.spotify) return true;
      else return false;
    default:
      throw new Error("checkProviderId type error");
  }
};
