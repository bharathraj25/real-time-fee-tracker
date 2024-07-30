const client = require("./client");
// Promisify Redis client methods for better async/await usage
const { promisify } = require("util");

const setAsync = promisify(client.set).bind(client);
const expireAsync = promisify(client.expire).bind(client);
async function setRedisKey(key, value, expirationInSeconds = null) {
  try {
    await setAsync(key, value);
    if (expirationInSeconds) {
      await expireAsync(key, expirationInSeconds);
    }
    console.log(`Key "${key}" set successfully.`);
  } catch (error) {
    console.error(`Error setting key "${key}":`, error);
  }
}

const getAsync = promisify(client.get).bind(client);
async function getRedisKey(key) {
  try {
    const value = await getAsync(key);
    if (value) {
      console.log(`Value for key "${key}" retrieved successfully: ${value}`);
    } else {
      console.log(`Key "${key}" does not exist.`);
    }
    return value;
  } catch (error) {
    console.error(`Error getting key "${key}":`, error);
  }
}

const delAsync = promisify(client.del).bind(client);
async function deleteRedisKey(key) {
  try {
    const result = await delAsync(key);
    if (result) {
      console.log(`Key "${key}" deleted successfully.`);
    } else {
      console.log(`Key "${key}" does not exist.`);
    }
  } catch (error) {
    console.error(`Error deleting key "${key}":`, error);
  }
}

module.exports = {
  setRedisKey,
  getRedisKey,
  deleteRedisKey,
};
