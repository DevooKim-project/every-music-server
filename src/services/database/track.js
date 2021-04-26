const Track = require("../../database/schema/track");

exports.storeTrack = async (data, artistId) => {
  try {
    // const { title, ids, artist, duration_ms, thumbnail } = data;
    const response = await Track.create({
      ...data,
      providerid: data.ids,
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

exports.updateTrack = async (title, providerid) => {
  try {
    const track = await Track.findOneAndUpdate(
      { title },
      { $set: { providerid: providerid } },
      { returnNewDocument: true }
    );
    return track;
  } catch (error) {
    throw error;
  }
};
