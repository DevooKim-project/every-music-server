const redis = require("redis");
const client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
);

const addArtist = (artist, service) => {
  const key = `artist-${artist.name}-${service}`;
  const value = artist.id;
  client.sadd(key, value, (err, data) => {
    if (err) throw err;
    return;
  });
};

const getArtist = (artist, service) => {
  console.log("artist: ", artist);
  const key = `artist-${artist.name}-${service}`;
  client.smembers(key, (err, data) => {
    if (err) throw err;
    return data;
  });
};

module.exports = { addArtist, getArtist };
