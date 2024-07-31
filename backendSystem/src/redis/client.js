const redis = require("redis");
const { REDIS_PORT, REDIS_HOST } = require("../config");
const client = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

client.on("connect", () => {
  console.log("Redis connected");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = client;
