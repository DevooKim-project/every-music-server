const redis = require("redis");
const util = require("util");

exports.client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
);

exports.addArtist = (artist, service) => {
  const key = `artist-${artist.name}-${service}`;
  const value = artist.id;
  client.sadd(key, value, (err, data) => {
    if (err) throw err;
    return;
  });
};

exports.getArtist = (artist, service) => {
  console.log("artist: ", artist);
  const key = `artist-${artist.name}-${service}`;
  client.smembers(key, (err, data) => {
    if (err) throw err;
    return data;
  });
};

exports.addTrack = (track, service) => {
  // const key = `artist-${artist.name}-${service}`;
  let artist = track.artists[0].name.toUpperCase();
  let title = track.title.toUpperCase();

  artist = artist.replace(/ /gi, "");
  title = title.replace(/ /gi, "");

  const key = `${artist}-${title}-${service}`;
  const id = track.id;
  // const value = artist.id;
  client.set(key, id, (err, data) => {
    if (err) throw err;
    return;
  });
};

exports.getTrack = async (track, service) => {
  try {
    let artist = track.artists[0].name.toUpperCase();
    let title = track.title.toUpperCase();

    artist = artist.replace(/ /gi, "");
    title = title.replace(/ /gi, "");
    const key = `${artist}-${title}-${service}`;
    const get = util.promisify(client.get).bind(client);
    const data = await get(key);

    return data;
  } catch (error) {
    throw error;
  }
};
