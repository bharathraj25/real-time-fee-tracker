const { describe, it, expect } = require("@jest/globals");
const moment = require("moment");
const {
  roundTimestamp,
  cachePrices,
} = require("../../../src/utils/externalPriceFeeder/cacheService");

const { setRedisKey } = require("../../../src/redis");
const { priceTimestampKeyBuilder } = require("../../../src/redis/keyBuilder");

describe("roundTimestamp", () => {
  it("should round timestamp to the start of the minute", () => {
    const timestamp = moment("2024-08-01T12:34:56").valueOf();
    const roundedTimestamp = roundTimestamp(timestamp, "min");
    expect(roundedTimestamp).toBe(moment("2024-08-01T12:34:00").valueOf());
  });

  it("should round timestamp to the start of the second", () => {
    const timestamp = moment("2024-08-01T12:34:56.789").valueOf();
    const roundedTimestamp = roundTimestamp(timestamp, "sec");
    expect(roundedTimestamp).toBe(moment("2024-08-01T12:34:56").valueOf());
  });

  it("should throw an error for invalid roundOffFlag", () => {
    const timestamp = moment().valueOf();
    expect(() => roundTimestamp(timestamp, "invalid")).toThrow(
      'Invalid roundOffFlag. Use "min" or "sec".'
    );
  });
});

jest.mock("../../../src/redis", () => ({
  setRedisKey: jest.fn(),
}));

jest.mock("../../../src/redis/keyBuilder", () => ({
  priceTimestampKeyBuilder: jest.fn(),
}));

describe("cachePrices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should cache prices correctly", async () => {
    const symbol = "ETH";
    const pricesData = [
      [1625097600, "USD", "ETH", "1000", "2000"],
      [1625184000, "USD", "ETH", "1500", "2500"],
    ];

    // Mock `priceTimestampKeyBuilder` to return a consistent key
    priceTimestampKeyBuilder.mockImplementation(
      (symbol, timestamp) => `price:${symbol}:${timestamp}`
    );

    await cachePrices(symbol, pricesData);

    // Check if `setRedisKey` is called with correct parameters
    expect(setRedisKey).toHaveBeenCalledWith(
      "price:ETH:1625097600",
      "2000.00",
      24 * 60 * 60
    );
    expect(setRedisKey).toHaveBeenCalledWith(
      "price:ETH:1625184000",
      "2500.00",
      24 * 60 * 60
    );
  });
});
