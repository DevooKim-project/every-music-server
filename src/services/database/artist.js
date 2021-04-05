const Artist = require("../../database/schema/artist");

const storeArtist = async (data) => {
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

const findArtist = async (name) => {
  try {
    const artist = await Artist.findOne({ name });
    return artist;
  } catch (error) {
    throw error;
  }
};

const updateArtist = async (name, provider_id) => {
  try {
    const artist = await Artist.updateOne({ name }, { provider_id });
    return artist;
  } catch (error) {
    throw error;
  }
};

module.exports = { storeArtist, findArtist, updateArtist };
