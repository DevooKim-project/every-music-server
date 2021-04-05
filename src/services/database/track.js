const Track = require("../../database/schema/track");

const storeTrack = async (data, artistId) => {
  try {
    // const { title, ids, artist, duration_ms, thumbnail } = data;
    const response = await Track.create({
      ...data,
      provider_id: data.ids,
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

const updateTrack = async (title, provider_id) => {
  try {
    const track = await Track.findOneAndUpdate(
      { title },
      { provider_id },
      { returnNewDocument: true }
    );
    return track;
  } catch (error) {
    throw error;
  }
};

module.exports = { storeTrack, findTrack, updateTrack };
