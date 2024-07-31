const axios = require("axios");
const { etherscanApiKey } = require("../config");

const etherscanService = async (
  poolAddress,
  startBlock = 0,
  endBlock = null,
  page = null,
  offset = null,
  sort = "asc"
) => {
  try {
    const requestUrlParams = [
      "https://api.etherscan.io/api",
      "?module=account",
      "&action=tokentx",
      `&address=${poolAddress}`,
      page ? `&page=${page}` : "",
      offset ? `&offset=${offset}` : "",
      `&startblock=${startBlock}`,
      endBlock ? `&endblock=${endBlock}` : "",
      `&sort=${sort}`,
      `&apikey=${etherscanApiKey}`,
    ];
    console.log(requestUrlParams.join(""));
    const response = await axios.get(requestUrlParams.join(""));
    console.log(response.status);
    return response.data;
  } catch (error) {
    throw error.message;
  }
};
module.exports = etherscanService;
