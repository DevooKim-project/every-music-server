const { Artist } = require("../database/schema");
const pick = require("../utils/pick");
const getArtistByName = async (name) => {
  return await Artist.findOne({ name });
};

const updateArtist = async (name, platformIds) => {
  return await Artist.findOneAndUpdate({ name }, { $set: { platformIds } }, { new: true });
};

const saveArtist = async (artistBody) => {
  const artist = await Artist.create({
    name: artistBody.name,
    platformIds: artistBody.platformIds,
  });
  return artist;
};

const caching = async (artistBody, key) => {
  let artist = await getArtistByName(artistBody.name);
  let platformIds;
  if (artist && Object.prototype.hasOwnProperty.call(artist, "platformIds")) {
    platformIds = track.platformIds;
  }
  const value = pick(platformIds, [key]);

  //플랫폼(key)의 Id가 캐시되어있지 않은 경우
  if (artist && !value[key]) {
    const platformIds = Object.assign({}, artist.platformIds, artistBody.platformIds);
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
