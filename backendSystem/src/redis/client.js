const redis = require("redis");
const { REDIS_PORT, REDIS_HOST } = require("../config");
const client = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

client.on("connect", () => {
  console.log("Redis connected");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = client;
