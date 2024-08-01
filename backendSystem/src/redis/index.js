const client = require("./client");

async function setRedisKey(key, value, expirationInSeconds = null) {
  try {
    if (expirationInSeconds !== null) {
      await client.set(key, value, "EX", expirationInSeconds);
    } else {
      await client.set(key, value);
    }
    // console.log(`Key "${key}" set successfully.`);
  } catch (error) {
    console.error(`Error setting key "${key}":`, error);
  }
}

async function getRedisKey(key) {
  try {
    const value = await client.get(key);
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

async function deleteRedisKey(key) {
  try {
    const result = await client.del(key);
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
