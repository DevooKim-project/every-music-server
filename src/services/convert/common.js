const { artistService, trackService, playlistService } = require("../database");
exports.uploadArtistTrack = async (trackData, provider) => {
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
      if (!hasProviderId(artist.providerid, provider)) {
        const providerid = {
          ...artist.providerid,
          ...trackData.artist.ids,
        };
        artist = artistService.updateArtist(trackData.artist.name, providerid);
      }
    } else {
      console.log("upload artist");
      artist = await artistService.uploadArtist(trackData.artist);
    }
    artistId = {
      local: artist.id,
      ...artist.providerid,
    };

    //Track
    let track = await trackService.findTrack(trackData.title, artistId.local);
    let trackId = "";

    if (track) {
      if (!hasProviderId(track.providerid, provider)) {
        const providerid = {
          ...track.providerid,
          ...trackData.ids,
        };
        artist = trackService.updateTrack(trackData.title, providerid);
      }
    } else {
      console.log("upload track");
      track = await trackService.uploadTrack(trackData, artistId.local);
    }
    trackId = {
      local: track.id,
      ...track.providerid,
    };

    trackData.artist.ids = artistId;
    trackData.ids = trackId;

    return trackData;
  } catch (error) {
    throw error;
  }
};

exports.uploadPlaylist = async (data) => {
  try {
    await playlistService.uploadPlaylist(data);
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

const hasProviderId = (providerid, provider) => {
  switch (provider) {
    case "youtube":
      if (providerid.youtube) return true;
      else return false;
    case "spotify":
      if (providerid.spotify) return true;
      else return false;
    default:
      throw new Error("checkProviderId type error");
  }
};
