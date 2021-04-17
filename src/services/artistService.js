const { Artist } = require("../database/schema");
const getArtistByName = async (name) => {
  return await Artist.findOne({ name });
};

const updateArtist = async (name, platformIds) => {
  return await Artist.findOneAndUpdate(
    { name },
    { $set: { platformIds } },
    { new: true }
  );
};

const saveArtist = async (artistBody) => {
  const artist = await Artist.create({
    name: artistBody.name,
    platformIds: artistBody.platformIds,
  });
  return artist;
};

const caching = async (artistBody, schema) => {
  let artist = await getArtistByName(artistBody.name);
  const object = artist ? artist.toJSON() : artist;
  const { value, error } = schema.validate(object, {
    allowUnknown: true,
  });

  if (artist && error) {
    const platformIds = Object.assign(
      {},
      artist.platformIds,
      artistBody.platformIds
    );
    console.log("update");
    artist = await updateArtist(artistBody.name, platformIds);
  }

  if (!artist) {
    console.log("save");
    artist = await saveArtist(artistBody);
  }

  return artist;
};

module.exports = {
  getArtistByName,
  updateArtist,
  saveArtist,
  caching,
};
