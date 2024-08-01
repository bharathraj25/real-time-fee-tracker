const { describe, it, expect } = require("@jest/globals");
const axios = require("axios");
const { etherscanApiKey } = require("../../src/config");
const etherscanService = require("../../src/utils/etherscanService");

jest.mock("axios");

describe("etherscanService", () => {
  const poolAddress = "0xPoolAddress";
  const startBlock = 0;
  const endBlock = 1000;
  const page = 1;
  const offset = 10;
  const sort = "asc";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return data successfully with all parameters", async () => {
    const mockResponse = { data: { result: "success" } };
    axios.get.mockResolvedValue(mockResponse);

    const result = await etherscanService(
      poolAddress,
      startBlock,
      endBlock,
      page,
      offset,
      sort
    );

    expect(axios.get).toHaveBeenCalledWith(
      `https://api.etherscan.io/api?module=account&action=tokentx&address=${poolAddress}&page=${page}&offset=${offset}&startblock=${startBlock}&endblock=${endBlock}&sort=${sort}&apikey=${etherscanApiKey}`
    );
    expect(result).toEqual(mockResponse.data);
  });

  it("should return data successfully with only required parameters", async () => {
    const mockResponse = { data: { result: "success" } };
    axios.get.mockResolvedValue(mockResponse);

    const result = await etherscanService(poolAddress);

    expect(axios.get).toHaveBeenCalledWith(
      `https://api.etherscan.io/api?module=account&action=tokentx&address=${poolAddress}&startblock=${startBlock}&sort=${sort}&apikey=${etherscanApiKey}`
    );
    expect(result).toEqual(mockResponse.data);
  });

  it("should throw an error if axios request fails", async () => {
    const mockError = new Error("Network Error");
    axios.get.mockRejectedValue(mockError);

    await expect(etherscanService(poolAddress)).rejects.toThrow(
      "Network Error"
    );
  });

  it("should include endBlock parameter if provided", async () => {
    const mockResponse = { data: { result: "success" } };
    axios.get.mockResolvedValue(mockResponse);

    const result = await etherscanService(poolAddress, startBlock, endBlock);

    expect(axios.get).toHaveBeenCalledWith(
      `https://api.etherscan.io/api?module=account&action=tokentx&address=${poolAddress}&startblock=${startBlock}&endblock=${endBlock}&sort=${sort}&apikey=${etherscanApiKey}`
    );
    expect(result).toEqual(mockResponse.data);
  });

  it("should include page and offset parameters if provided", async () => {
    const mockResponse = { data: { result: "success" } };
    axios.get.mockResolvedValue(mockResponse);

    const result = await etherscanService(
      poolAddress,
      startBlock,
      null,
      page,
      offset
    );

    expect(axios.get).toHaveBeenCalledWith(
      `https://api.etherscan.io/api?module=account&action=tokentx&address=${poolAddress}&page=${page}&offset=${offset}&startblock=${startBlock}&sort=${sort}&apikey=${etherscanApiKey}`
    );
    expect(result).toEqual(mockResponse.data);
  });
});
