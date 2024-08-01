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
  const response = await axios.get(requestUrlParams.join(""));
  return response.data;
};
module.exports = etherscanService;
