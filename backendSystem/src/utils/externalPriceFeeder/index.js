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
  const cachedPrice = await redisClient.get(cacheKey);
  if (cachedPrice) {
    return parseFloat(cachedPrice);
  }

  // If not in cache, fetch from API
  try {
    const data = await getPriceFromBinanceSpot(symbol, timestamp, interval);

    // Cache all prices
    await cachePrices(symbol, data);

    // Return the price for the rounded timestamp
    const roundedClosePrice = data.find((item) => item[0] === roundedTimestamp);
    if (!roundedClosePrice) {
      throw new Error("Price not found for the given timestamp");
    }
    return parseFloat(roundedClosePrice[4]).toFixed(2);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Internal Server Error");
  }
};

module.exports = { getClosePrice };
