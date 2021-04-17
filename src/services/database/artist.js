const Artist = require("../../database/schema/artist");

exports.uploadArtist = async (data) => {
  try {
    const { name, ids } = data;
    const response = await Artist.create({
      name,
      providerid: ids,
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

exports.updateArtist = async (name, providerid) => {
  try {
    const artist = await Artist.updateOne(
      { name },
      { $set: { providerid: providerid } }
    );
    return artist;
  } catch (error) {
    throw error;
  }
};
