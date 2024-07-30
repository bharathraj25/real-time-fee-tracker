const { Web3 } = require("web3");

// Replace with a public RPC URL from a service like Alchemy or any other public Ethereum node provider
const rpcUrl = "https://eth-mainnet.alchemyapi.io/v2/demo";

// console.log(new Web3.providers.http.HttpProvider(rpcUrl));
// Create a new Web3 instance
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

const getLatestBlockNumber = async (chainId = 1) => {
  try {
    const latestBlockNumber = await web3.eth.getBlockNumber();
    console.log("Latest Block Number:", latestBlockNumber);
    return Number(latestBlockNumber);
  } catch (error) {
    console.error("Error getting the latest block number:", error);
  }
};

module.exports = getLatestBlockNumber;
