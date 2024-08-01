const { REDIS_PORT, REDIS_HOST } = require("./config");

const redisConnection = {
  connection: {
    port: REDIS_PORT,
    host: REDIS_HOST,
    enableOfflineQueue: false,
  },
};

const retryMechanism = {
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
};

const rateLimiter = {
  limiter: {
    max: 2,
    duration: 10000,
  },
};

const stalledCountOpts = {
  maxStalledCount: 10,
};

module.exports = {
  redisConnection,
  retryMechanism,
  rateLimiter,
  stalledCountOpts,
};
