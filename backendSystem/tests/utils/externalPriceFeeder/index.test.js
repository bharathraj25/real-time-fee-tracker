const { describe, it, expect } = require("@jest/globals");
const { getRedisKey } = require("../../../src/redis");
const { priceTimestampKeyBuilder } = require("../../../src/redis/keyBuilder");
const {
  getPriceFromBinanceSpot,
} = require("../../../src/utils/externalPriceFeeder/apiService");
const {
  roundTimestamp,
  cachePrices,
} = require("../../../src/utils/externalPriceFeeder/cacheService");
const { getClosePrice } = require("../../../src/utils/externalPriceFeeder");

jest.mock("../../../src/redis", () => ({
  getRedisKey: jest.fn(),
}));

jest.mock("../../../src/redis/keyBuilder", () => ({
  priceTimestampKeyBuilder: jest.fn(),
}));

jest.mock("../../../src/utils/externalPriceFeeder/apiService", () => ({
  getPriceFromBinanceSpot: jest.fn(),
}));

jest.mock("../../../src/utils/externalPriceFeeder/cacheService", () => ({
  roundTimestamp: jest.fn(),
  cachePrices: jest.fn(),
}));

describe("getClosePrice", () => {
  const symbol = "BTCUSDT";
  const timestamp = 1638316800000; // Example timestamp in milliseconds
  const roundedTimestamp = 1638316800000; // Assuming rounding does not change the timestamp
  const interval = "1s";
  const roundOffFlag = "sec";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return cached price if available", async () => {
    const cacheKey = "someCacheKey";
    const cachedPrice = "50000.00";

    priceTimestampKeyBuilder.mockReturnValue(cacheKey);
    getRedisKey.mockResolvedValue(cachedPrice);

    const price = await getClosePrice(
      symbol,
      timestamp,
      interval,
      roundOffFlag
    );

    expect(price).toBe(parseFloat(cachedPrice).toFixed(2));
    expect(getRedisKey).toHaveBeenCalledWith(cacheKey);
    expect(getPriceFromBinanceSpot).not.toHaveBeenCalled();
  });

  it("should fetch price from API and cache it if not in Redis", async () => {
    const cacheKey = "someCacheKey";
    const priceData = [
      [
        1638316800000,
        "50000",
        "51000",
        "49000",
        "50500",
        "1000000",
        1638320400000,
        "500000000",
        100,
        "1000000",
        "500000000",
        "0",
      ],
    ];

    priceTimestampKeyBuilder.mockReturnValue(cacheKey);
    getRedisKey.mockResolvedValue(null);
    getPriceFromBinanceSpot.mockResolvedValue(priceData);
    cachePrices.mockResolvedValue();
    roundTimestamp.mockReturnValue(roundedTimestamp);

    const result = "50500.00";
    const roundedClosePrice = priceData.find(
      (item) => item[0] === roundedTimestamp
    );

    const price = await getClosePrice(
      symbol,
      timestamp,
      interval,
      roundOffFlag
    );

    expect(price).toBe(result);
    expect(getRedisKey).toHaveBeenCalledWith(cacheKey);
    expect(getPriceFromBinanceSpot).toHaveBeenCalledWith(
      symbol,
      roundedTimestamp,
      interval
    );
    expect(cachePrices).toHaveBeenCalledWith(symbol, priceData);
  });

  it("should throw an error if price is not found in API response", async () => {
    priceTimestampKeyBuilder.mockReturnValue("someCacheKey");
    getRedisKey.mockResolvedValue(null);
    getPriceFromBinanceSpot.mockResolvedValue([]);
    cachePrices.mockResolvedValue();
    roundTimestamp.mockReturnValue(roundedTimestamp);

    await expect(
      getClosePrice(symbol, timestamp, interval, roundOffFlag)
    ).rejects.toThrow("Price not found for the given timestamp");

    expect(getRedisKey).toHaveBeenCalledWith("someCacheKey");
    expect(getPriceFromBinanceSpot).toHaveBeenCalledWith(
      symbol,
      roundedTimestamp,
      interval
    );
  });

  it("should handle and throw errors from API fetch", async () => {
    const errorMessage = "Network Error";
    priceTimestampKeyBuilder.mockReturnValue("someCacheKey");
    getRedisKey.mockResolvedValue(null);
    getPriceFromBinanceSpot.mockRejectedValue(new Error(errorMessage));
    roundTimestamp.mockReturnValue(roundedTimestamp);

    await expect(
      getClosePrice(symbol, timestamp, interval, roundOffFlag)
    ).rejects.toThrow(errorMessage);

    expect(getRedisKey).toHaveBeenCalledWith("someCacheKey");
    expect(roundTimestamp).toHaveBeenCalledWith(timestamp, roundOffFlag);
    expect(getPriceFromBinanceSpot).toHaveBeenCalledWith(
      symbol,
      roundedTimestamp,
      interval
    );
  });
});
