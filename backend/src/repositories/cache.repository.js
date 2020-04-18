const Redis = require("../database/redis/redis").get();

const set = (key, value, seconds) => {
  Redis.set(Key, value, "EX", seconds);
};

const exists = (key) => Redis.exists(key);

const del = (key) => Redis.del(key);

module.exports = {
  set,
  exists,
  del,
};
