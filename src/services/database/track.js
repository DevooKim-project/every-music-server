const Track = require("../../database/schema/track");

const storeTrack = async (data, artistId) => {
  try {
    // const { title, ids, artist, duration_ms, thumbnail } = data;
    const response = await Track.create({
      ...data,
      providerId: data.ids,
      artist: artistId,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const findTrack = async (title, artistId) => {
  try {
    const track = await Track.findOne({ title, artist: artistId });
    return track;
  } catch (error) {
    throw error;
  }
};

const updateTrack = async (title, providerId) => {
  try {
    const track = await Track.updateOne({ title }, { providerId });
    return track;
  } catch (error) {
    throw error;
  }
};

module.exports = { storeTrack, findTrack, updateTrack };
