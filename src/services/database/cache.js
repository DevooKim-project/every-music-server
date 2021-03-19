const redis = require("redis");
const client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
);

const addCacheSet = (key, value) => {
  client.sadd(key, value, (err, data) => {
    if (err) throw err;
    return;
  });
};

const getCacheSet = (key) => {
  client.smembers(key, (err, data) => {
    if (err) throw err;
    return data;
  });
};

module.exports = { addCacheSet, getCacheSet };
