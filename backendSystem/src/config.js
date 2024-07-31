require("dotenv").config();

const PORT = process.env.SERVER_PORT || 3001;
const DOMAIN = process.env.DOMAIN || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || "6379";
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const moralisAppId = process.env.MORALIS_APP_ID;
const ETHERSCAN_MAX_WINDOW = 10000;

module.exports = {
  PORT,
  DOMAIN,
  REDIS_PORT,
  REDIS_HOST,
  etherscanApiKey,
  moralisAppId,
  ETHERSCAN_MAX_WINDOW,
};
