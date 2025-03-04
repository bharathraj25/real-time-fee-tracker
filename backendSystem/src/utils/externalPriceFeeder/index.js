const { getRedisKey } = require("../../redis");
const { priceTimestampKeyBuilder } = require("../../redis/keyBuilder");
const { getPriceFromBinanceSpot } = require("./apiService");
const { roundTimestamp, cachePrices } = require("./cacheService");

const getClosePrice = async (
  symbol,
  timestamp,
  interval = "1s",
  roundOffFlag = "sec"
) => {
  const roundedTimestamp = roundTimestamp(timestamp, roundOffFlag);
  const cacheKey = priceTimestampKeyBuilder(symbol, timestamp);

  // Check Redis cache
  const cachedPrice = await getRedisKey(cacheKey);

  if (cachedPrice) {
    return parseFloat(cachedPrice).toFixed(2);
  }

  // If not in cache, fetch from API
  const data = await getPriceFromBinanceSpot(
    symbol,
    roundedTimestamp,
    interval
  );

  // Cache all prices
  await cachePrices(symbol, data);

  // Return the price for the rounded timestamp
  const roundedClosePrice = data.find((item) => item[0] === roundedTimestamp);
  if (!roundedClosePrice) {
    throw new Error("Price not found for the given timestamp");
  }
  return parseFloat(roundedClosePrice[4]).toFixed(2);
};

module.exports = { getClosePrice };
