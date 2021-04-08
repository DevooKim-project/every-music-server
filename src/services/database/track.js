const Track = require("../../database/schema/track");

exports.storeTrack = async (data, artistId) => {
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

exports.findTrack = async (title, artistId) => {
  try {
    const track = await Track.findOne({ title, artist: artistId });
    return track;
  } catch (error) {
    throw error;
  }
};

exports.updateTrack = async (title, provider_id) => {
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
