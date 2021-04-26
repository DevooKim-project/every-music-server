// const { artistService, trackService, playlistService } = require("./database");
const { platformTypes } = require("../config/type");
const { Track } = require("../database/schema");
const pick = require("../utils/pick");

const getTrackByTitleAndArtist = async (title, artistId) => {
  return await Track.findOne({ title, artist: artistId });
};

const updateTrack = async (title, platformIds) => {
  return await Track.findOneAndUpdate({ title }, { $set: { platformIds } }, { new: true });
};

const saveTrack = async (trackBody, artistId) => {
  const track = await Track.create({
    ...trackBody,
    platformIds: trackBody.platformIds,
    artist: artistId,
  });
  return track;
};

const caching = async (trackBody, artist, key) => {
  let track = await getTrackByTitleAndArtist(trackBody.title, artist.id);

  let platformIds;
  if (track && Object.prototype.hasOwnProperty.call(track, "platformIds")) {
    platformIds = track.platformIds;
  }
  const value = pick(platformIds, [key]);

  //플랫폼(key)의 Id가 캐시되어있지 않은 경우
  if (track && !value[key]) {
    const platformIds = Object.assign({}, track.platformIds, trackBody.platformIds);
    console.log("update");
    track = await updateTrack(trackBody.title, platformIds);
  }

  if (!track) {
    console.log("save");
    track = await saveTrack(trackBody, artist.id);
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
  saveTrack,
  caching,
};
