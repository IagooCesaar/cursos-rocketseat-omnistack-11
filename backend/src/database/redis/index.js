const Redis = require("ioredis");

const { ERR_REDIS_NOT_INITIALIZED } = require("../../utils/errorTypes");

let redis = null;

const connect = () => {
  redis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  });
};

const monitor = async () => {
  const monitor = await redis.monitor();
  monitor.on("monitor", console.log);
  monitor.disconnect();
};

const get = () => {
  if (!redis) {
    throw new Error(ERR_REDIS_NOT_INITIALIZED);
  }
  return redis;
};

module.exports = {
  connect,
  get,
  monitor,
};
