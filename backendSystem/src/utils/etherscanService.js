const axios = require("axios");

const etherscanService = async (
  poolAddress,
  startBlock = 0,
  endBlock = null,
  page = 1,
  offset = null,
  sort = "asc"
) => {
  try {
    const requestUrlParams = [
      "https://api.etherscan.io/api",
      "?module=account",
      "&action=tokentx",
      `&address=${poolAddress}`,
      `&page=${page}`,
      offset ? `&offset=${offset}` : "",
      `&startblock=${startBlock}`,
      endBlock ? `&endblock=${endBlock}` : "",
      `&sort=${sort}`,
      `&apikey=${etherscanApiKey}`,
    ];
    console.log(requestUrlParams.join(""));
    const response = await axios.get(requestUrlParams.join(""));
    return response.data;
  } catch (error) {
    throw error.message;
  }
};
module.exports = etherscanService;
