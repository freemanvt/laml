const Redis = require('ioredis');
const logger = require('./../lib/logger');

const redisClient = new Redis({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  username: "default", // needs Redis >= 6
  password: "eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81", // need to pull this as part of CI/CD pipeline
});

logger.info(`Redis connected`);

const set = async (key, value) => {
  return await redisClient.set(key, value);
}

const get = async (key) => await redisClient.get(key);

module.exports = {
  set,
  get,
  redisClient
};