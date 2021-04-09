const Artist = require("../../database/schema/artist");

exports.storeArtist = async (data) => {
  try {
    const { name, ids } = data;
    const response = await Artist.create({
      name,
      provider_id: ids,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

exports.findArtist = async (name) => {
  try {
    const artist = await Artist.findOne({ name });
    return artist;
  } catch (error) {
    throw error;
  }
};

exports.updateArtist = async (name, provider_id) => {
  try {
    const artist = await Artist.updateOne(
      { name },
      { $set: { provider_id: provider_id } }
    );
    return artist;
  } catch (error) {
    throw error;
  }
};
