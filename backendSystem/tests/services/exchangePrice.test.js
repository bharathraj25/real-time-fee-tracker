const { describe, it, expect } = require("@jest/globals");
const { getExchangePrice } = require("../../src/services/exchangePrice");
const { HttpError } = require("../../src/errors.js");
const {
  web3,
  decodeTransactionLogs,
  getTokenDetails,
} = require("../../src/utils/web3Services.js");
const abi = require("../../src/constants/uniswapABI");

jest.mock("../../src/utils/web3Services.js");
jest.mock("../../src/constants/uniswapABI");
jest.mock("../../src/errors", () => ({
  HttpError: class extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));

describe("getExchangePrice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should calculate and return exchange price details successfully", async () => {
    const contractAddress = "0xContractAddress";
    const txnHash = "0xTxnHash";
    const mockTokenSwapLogs = [
      {
        events: [
          { name: "amount0", value: 10 ** 10 },
          { name: "amount1", value: 5 * 10 ** 5 },
        ],
      },
    ];
    const mockTokenDetails0 = { tokenSymbol: "TOKEN0", tokenDecimals: 18 };
    const mockTokenDetails1 = { tokenSymbol: "TOKEN1", tokenDecimals: 6 };

    decodeTransactionLogs.mockResolvedValue(mockTokenSwapLogs);
    getTokenDetails
      .mockResolvedValueOnce(mockTokenDetails0)
      .mockResolvedValueOnce(mockTokenDetails1);

    const tokenContract = {
      methods: {
        token0: jest.fn().mockReturnValue({
          call: jest.fn().mockResolvedValue("0xToken0Address"),
        }),
        token1: jest.fn().mockReturnValue({
          call: jest.fn().mockResolvedValue("0xToken1Address"),
        }),
      },
    };
    web3.eth.Contract.mockImplementation(() => tokenContract);

    const result = await getExchangePrice(contractAddress, txnHash);

    expect(result).toEqual({
      txnSpecific: {
        tokenIn: "TOKEN0",
        tokenInAmount: 1e-8,
        tokenOut: "TOKEN1",
        tokenOutAmount: 0.5,
        price: 50000000, // (1000 / 500) * (10^6 - 10^18) = 2
        description: `Swaped with an exchange rate of 1 TOKEN1 = 2e-8 TOKEN0`,
      },
      exchangePrices: {
        "TOKEN0 -> TOKEN1": `1 TOKEN0 = 50000000 TOKEN1`,
        "TOKEN1 -> TOKEN0": `1 TOKEN1 = 2e-8 TOKEN0`,
      },
    });
    expect(decodeTransactionLogs).toHaveBeenCalledWith(
      contractAddress,
      txnHash
    );
    expect(getTokenDetails).toHaveBeenCalledWith("0xToken0Address");
    expect(getTokenDetails).toHaveBeenCalledWith("0xToken1Address");
  });

  it("should throw HttpError if no token swap logs are found", async () => {
    const contractAddress = "0xContractAddress";
    const txnHash = "0xTxnHash";
    decodeTransactionLogs.mockResolvedValue([]);

    await expect(getExchangePrice(contractAddress, txnHash)).rejects.toThrow(
      HttpError
    );
    await expect(
      getExchangePrice(contractAddress, txnHash)
    ).rejects.toHaveProperty(
      "message",
      "No token swap logs found in the transaction."
    );
  });

  it("should throw HttpError if error occurs in token details retrieval", async () => {
    const contractAddress = "0xContractAddress";
    const txnHash = "0xTxnHash";
    const mockTokenSwapLogs = [
      {
        events: [
          { name: "amount0", value: "1000" },
          { name: "amount1", value: "500" },
        ],
      },
    ];

    decodeTransactionLogs.mockResolvedValue(mockTokenSwapLogs);
    getTokenDetails.mockRejectedValue(new Error("Token details error"));

    await expect(getExchangePrice(contractAddress, txnHash)).rejects.toThrow(
      HttpError
    );
    await expect(
      getExchangePrice(contractAddress, txnHash)
    ).rejects.toHaveProperty("message", "Token details error");
  });

  it("should throw HttpError if error occurs in transaction logs decoding", async () => {
    const contractAddress = "0xContractAddress";
    const txnHash = "0xTxnHash";
    decodeTransactionLogs.mockRejectedValue(new Error("Decoding error"));

    await expect(getExchangePrice(contractAddress, txnHash)).rejects.toThrow(
      HttpError
    );
    await expect(
      getExchangePrice(contractAddress, txnHash)
    ).rejects.toHaveProperty("message", "Decoding error");
  });

  it("should throw HttpError if error occurs in contract interaction", async () => {
    const contractAddress = "0xContractAddress";
    const txnHash = "0xTxnHash";
    const mockTokenSwapLogs = [
      {
        events: [
          { name: "amount0", value: "1000" },
          { name: "amount1", value: "500" },
        ],
      },
    ];

    decodeTransactionLogs.mockResolvedValue(mockTokenSwapLogs);
    const tokenContract = {
      methods: {
        token0: jest.fn().mockImplementation(() => {
          throw new Error("Contract interaction error");
        }),
        token1: jest.fn().mockResolvedValue("0xToken1Address"),
      },
    };
    web3.eth.Contract.mockImplementation(() => tokenContract);

    await expect(getExchangePrice(contractAddress, txnHash)).rejects.toThrow(
      HttpError
    );
    await expect(
      getExchangePrice(contractAddress, txnHash)
    ).rejects.toHaveProperty("message", "Contract interaction error");
  });
});
