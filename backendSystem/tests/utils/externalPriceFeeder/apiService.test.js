const { describe, it, expect } = require("@jest/globals");
const axios = require("axios");
const {
  getPriceFromBinanceSpot,
} = require("../../../src/utils/externalPriceFeeder/apiService");

jest.mock("axios");

describe("getPriceFromBinanceSpot", () => {
  const symbol = "BTCUSDT";
  const timestamp = "1638316800000"; // Example timestamp

  it("should fetch price data successfully", async () => {
    const mockData = [
      [
        1638316800000, // Open time
        "50000", // Open price
        "51000", // High price
        "49000", // Low price
        "50500", // Close price
        "1000000", // Volume
        1638320400000, // Close time
        "500000000", // Quote asset volume
        100, // Number of trades
        "1000000", // Taker buy base asset volume
        "500000000", // Taker buy quote asset volume
        "0", // Ignore
      ],
    ];

    axios.get.mockResolvedValue({ data: mockData });

    const data = await getPriceFromBinanceSpot(symbol, timestamp);
    expect(data).toEqual(mockData);
  });

  it("should throw an error if the request fails", async () => {
    const errorMessage = "Network Error";
    axios.get.mockRejectedValue(new Error(errorMessage));

    await expect(getPriceFromBinanceSpot(symbol, timestamp)).rejects.toThrow(
      `Error fetching price from Binance: ${errorMessage}`
    );
  });

  it("should throw an error if API response is unexpected null", async () => {
    axios.get.mockResolvedValue(null);

    await expect(getPriceFromBinanceSpot(symbol, timestamp)).rejects.toThrow(
      `Error fetching price from Binance: Cannot read properties of null (reading 'data')`
    );
  });
});
