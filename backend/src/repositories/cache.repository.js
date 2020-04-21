const Redis = require("../database/redis");

const set = (key, value, seconds) => {
  const connRedis = Redis.get();
  connRedis.set(key, value, "EX", seconds);
};

const exists = async (key) => {
  const connRedis = Redis.get();
  return connRedis.get(key);
};

const del = (key) => {
  const connRedis = Redis.get();
  connRedis.del(key);
};

module.exports = {
  set,
  exists,
  del,
};
