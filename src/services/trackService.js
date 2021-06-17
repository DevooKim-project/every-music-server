const { Track } = require("../database/schema");
const pick = require("../utils/pick");

const getTrackByTitleAndArtist = async (title, artistId) => {
  return await Track.findOne({ title, artist: artistId });
};

const updateTrack = async (id, platformIds) => {
  return await Track.findOneAndUpdate({ _id: id }, { $set: { platformIds } }, { new: true });
};

const createTrack = async (trackBody, artistId) => {
  const track = await Track.create({
    ...trackBody,
    platformIds: trackBody.platformIds,
    artist: artistId,
  });
  return track;
};

const caching = async (trackBody, artist, key) => {
  let track = await getTrackByTitleAndArtist(trackBody.title, artist.id);

  const platformIds = track ? track.platformIds : undefined;
  const value = pick(platformIds, [key]);

  //플랫폼(key)의 Id가 캐시되어있지 않은 경우
  if (track && !value[key]) {
    Object.assign(track.platformIds, trackBody.platformIds);
    await track.save();
  }

  if (!track) {
    track = await createTrack(trackBody, artist.id);
  }

  return track;
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

module.exports = {
  getTrackByTitleAndArtist,
  updateTrack,
  createTrack,
  caching,
};
