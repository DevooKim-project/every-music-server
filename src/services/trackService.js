// const { artistService, trackService, playlistService } = require("./database");
const { platformTypes } = require("../config/type");
const { Track } = require("../database/schema");

const getTrackByTitleAndArtist = async (title, artist) => {
  return await Track.findOne({ title, artist: artist.platformId.local });
};

const updateTrack = async (title, platformId) => {
  return await Track.findOneAndUpdate(
    { title },
    { $set: { platformId } },
    { returnNewDocument: true }
  );
};

const saveTrack = async (trackBody, artist) => {
  const track = await Track.create({
    ...trackBody,
    platformId: trackBody.ids,
    artist: artist.platformId.local,
  });
  return track;
};

const caching = async (trackBody, artist, schema) => {
  const track = await getTrackByTitleAndArtist(trackBody.title, artist);
  const { error } = schema.validate(track.platform);
  if (track && error) {
    Object.assign(track.platformId, trackBody.ids);
    track = updateTrack(trackBody.title, track.platformId);
  } else {
    track = await saveTrack(trackBody, artist);
  }

  Object.assign(track.platformId, { local: track._id });

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
