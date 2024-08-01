const { describe, it, expect } = require("@jest/globals");
const { Web3 } = require("web3");
const { moralisAppId } = require("../../src/config");
const abiDecoder = require("abi-decoder");
const abi = require("../../src/constants/uniswapABI");
const {
  web3,
  getLatestBlockNumber,
  decodeTransactionLogs,
  getTokenDetails,
} = require("../../src/utils/web3Services");

// Mock the Web3 library
jest.mock("web3");

const mockTransactionReceipt = {
  logs: [
    {
      address: "0xContractAddress",
      name: "Swap",
      events: [
        { name: "amount0", value: "1000" },
        { name: "amount1", value: "2000" },
      ],
    },
  ],
};

const mockTokenDetails = {
  methods: {
    symbol: jest.fn().mockReturnThis(),
    decimals: jest.fn().mockReturnThis(),
    call: jest.fn().mockResolvedValueOnce("TOKEN").mockResolvedValueOnce("18"),
  },
};

describe("web3Services", () => {
  beforeAll(() => {
    web3.eth = {
      getBlockNumber: jest.fn(),
      getTransactionReceipt: jest.fn(),
      Contract: jest.fn().mockImplementation(() => mockTokenDetails),
    };
    abiDecoder.addABI = jest.fn();
    abiDecoder.decodeLogs = jest.fn();
  });

  describe("getLatestBlockNumber", () => {
    it("should return the latest block number", async () => {
      const mockBlockNumber = 123456;
      web3.eth.getBlockNumber.mockResolvedValue(mockBlockNumber);

      const result = await getLatestBlockNumber();

      expect(web3.eth.getBlockNumber).toHaveBeenCalled();
      expect(result).toBe(mockBlockNumber);
    });

    it("should throw an error if web3.eth.getBlockNumber fails", async () => {
      const error = new Error("Error fetching block number");
      web3.eth.getBlockNumber.mockRejectedValue(error);

      await expect(getLatestBlockNumber()).rejects.toThrow(
        "Error fetching block number"
      );
    });
  });

  describe("decodeTransactionLogs", () => {
    it("should decode transaction logs successfully", async () => {
      web3.eth.getTransactionReceipt.mockResolvedValue(mockTransactionReceipt);
      abiDecoder.decodeLogs.mockReturnValue(mockTransactionReceipt.logs);

      const result = await decodeTransactionLogs(
        "0xContractAddress",
        "0xTxnHash"
      );

      expect(web3.eth.getTransactionReceipt).toHaveBeenCalledWith("0xTxnHash");
      expect(abiDecoder.decodeLogs).toHaveBeenCalledWith(
        mockTransactionReceipt.logs
      );
      expect(result).toEqual(mockTransactionReceipt.logs);
    });

    it("should throw an error if transaction receipt is not found", async () => {
      web3.eth.getTransactionReceipt.mockResolvedValue(null);

      await expect(
        decodeTransactionLogs("0xContractAddress", "0xTxnHash")
      ).rejects.toThrow("Transaction receipt not found for 0xTxnHash");
    });

    it("should return empty array if no token swap logs are found", async () => {
      web3.eth.getTransactionReceipt.mockResolvedValue(mockTransactionReceipt);
      abiDecoder.decodeLogs.mockReturnValue([]);

      const result = await decodeTransactionLogs(
        "0xContractAddress",
        "0xTxnHash"
      );

      expect(result).toEqual([]);
    });
  });

  describe("getTokenDetails", () => {
    it("should return token details successfully", async () => {
      const result = await getTokenDetails("0xTokenAddress");

      expect(web3.eth.Contract).toHaveBeenCalledWith(
        abi.erc20,
        "0xTokenAddress"
      );
      expect(mockTokenDetails.methods.symbol().call).toHaveBeenCalled();
      expect(mockTokenDetails.methods.decimals().call).toHaveBeenCalled();
      expect(result).toEqual({ tokenSymbol: "TOKEN", tokenDecimals: 18 });
    });

    it("should throw an error if token symbol retrieval fails", async () => {
      mockTokenDetails.methods
        .symbol()
        .call.mockRejectedValueOnce(new Error("Symbol error"));

      await expect(getTokenDetails("0xTokenAddress")).rejects.toThrow(
        "Symbol error"
      );
    });

    it("should throw an error if token decimals retrieval fails", async () => {
      mockTokenDetails.methods
        .decimals()
        .call.mockRejectedValueOnce(new Error("Decimals error"));

      await expect(getTokenDetails("0xTokenAddress")).rejects.toThrow(
        "Decimals error"
      );
    });
  });
});
