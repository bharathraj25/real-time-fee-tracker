const { describe, it, expect } = require("@jest/globals");
const { getExchangePrice } = require("../../src/controllers/exchangePrice");
const exchangePriceService = require("../../src/services/exchangePrice");

jest.mock("../../src/services/exchangePrice");

describe("getExchangePrice", () => {
  let req, res, next;

  beforeEach(() => {
    // Mock req, res, and next
    req = {
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return exchange price details with status 200 on success", async () => {
    // Arrange
    const mockPriceDetails = { price: 123.45 };
    req.query = { txnHash: "abc123", poolAddress: "pool1" };
    exchangePriceService.getExchangePrice.mockResolvedValue(mockPriceDetails);

    // Act
    await getExchangePrice(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPriceDetails);
    expect(exchangePriceService.getExchangePrice).toHaveBeenCalledWith(
      "pool1",
      "abc123"
    );
  });

  it("should call next with error if exchangePriceService throws an error", async () => {
    // Arrange
    const mockError = new Error("Service error");
    req.query = { txnHash: "abc123", poolAddress: "pool1" };
    exchangePriceService.getExchangePrice.mockRejectedValue(mockError);

    // Act
    await getExchangePrice(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(mockError);
  });

  it("should handle missing txnHash and poolAddress gracefully", async () => {
    // Arrange
    const mockError = new Error("Missing parameters");
    req.query = {};
    exchangePriceService.getExchangePrice.mockRejectedValue(mockError);

    // Act
    await getExchangePrice(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(mockError);
  });

  it("should handle missing poolAddress", async () => {
    // Arrange
    const mockError = new Error("Missing poolAddress");
    req.query = { txnHash: "abc123" };
    exchangePriceService.getExchangePrice.mockRejectedValue(mockError);

    // Act
    await getExchangePrice(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(mockError);
  });

  it("should handle missing txnHash", async () => {
    // Arrange
    const mockError = new Error("Missing txnHash");
    req.query = { poolAddress: "pool1" };
    exchangePriceService.getExchangePrice.mockRejectedValue(mockError);

    // Act
    await getExchangePrice(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(mockError);
  });

  it("should handle invalid query parameters", async () => {
    // Arrange
    const mockError = new Error("Invalid parameters");
    req.query = { txnHash: "", poolAddress: "pool1" };
    exchangePriceService.getExchangePrice.mockRejectedValue(mockError);

    // Act
    await getExchangePrice(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(mockError);
  });
});
