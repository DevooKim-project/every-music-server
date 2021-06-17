const { Artist } = require("../database/schema");
const pick = require("../utils/pick");

const getArtistByName = async (name) => {
  return await Artist.findOne({ name });
};

const updateArtist = async (id, platformIds) => {
  return await Artist.findOneAndUpdate({ _id: id }, { $set: { platformIds } }, { new: true });
};

const createArtist = async (artistBody) => {
  const artist = await Artist.create({
    name: artistBody.name,
    platformIds: artistBody.platformIds,
  });
  return artist;
};

const caching = async (artistBody, key) => {
  let artist = await getArtistByName(artistBody.name);

  const platformIds = artist ? artist.platformIds : undefined;
  const value = pick(platformIds, [key]);

  //플랫폼(key)의 Id가 캐시되어있지 않은 경우
  if (artist && !value[key]) {
    Object.assign(artist.platformIds, artistBody.platformIds);
    await artist.save();
  }

  if (!artist) {
    artist = await createArtist(artistBody);
  }

  return artist;
};

module.exports = {
  getArtistByName,
  updateArtist,
  createArtist,
  caching,
};
