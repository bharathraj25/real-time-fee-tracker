const axios = require("axios");
const moment = require("moment");
const { setRedisKey } = require("../../redis");
const { priceTimestampKeyBuilder } = require("../../redis/keyBuilder");

const REDIS_EXPIRATION = 5 * 60; // 5mins

const roundTimestamp = (timestamp, roundOffFlag) => {
  const date = moment(timestamp);
  if (roundOffFlag === "min") {
    return date.startOf("minute").valueOf();
  } else if (roundOffFlag === "sec") {
    return date.startOf("second").valueOf();
  }
  throw new Error('Invalid roundOffFlag. Use "min" or "sec".');
};

const cachePrices = async (symbol, pricesData) => {
  const cacheMap = pricesData.reduce((map, item) => {
    const timestamp = item[0];
    const closePrice = parseFloat(item[4]).toFixed(2); // Rounded to two decimal places
    map[timestamp] = closePrice;
    return map;
  }, {});

  // Cache all prices using a hash map
  for (const [timestamp, closePrice] of Object.entries(cacheMap)) {
    const cacheKey = priceTimestampKeyBuilder(symbol, timestamp);
    await setRedisKey(cacheKey, closePrice, REDIS_EXPIRATION);
  }
};

module.exports = { cachePrices, roundTimestamp };
