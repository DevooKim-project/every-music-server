const { Artist } = require("../database/schema");

const getArtistByName = async (name) => {
  return await Artist.findOne({ name });
};

const updateArtist = async (name, platformId) => {
  return await Artist.findOneAndUpdate(
    { name },
    { $set: { platformId } },
    { returnNewDocument: true }
  );
};

const saveArtist = async (artistBody) => {
  const artist = await Artist.create({
    name: artistBody.name,
    providerId: artistBody.ids,
  });
  return artist;
};

const caching = async (artistBody, schema) => {
  let artist = await getArtistByName(artistBody.name);

  const { error } = schema.validate(artist.platform);
  if (artist && error) {
    Object.assign(artist.platformId, artistBody.ids);
    artist = updateArtist(artistBody.name, artist.platformId);
  } else {
    artist = await saveArtist(artistBody);
  }

  Object.assign(artist.platformId, { local: artist._id });

  return artist;
};

module.exports = {
  getArtistByName,
  updateArtist,
  saveArtist,
  caching,
};
