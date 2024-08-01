const { Web3 } = require("web3");
const { moralisAppId } = require("../config");
const abiDecoder = require("abi-decoder");
const abi = require("../constants/uniswapABI");

// Replace with a public RPC URL from a service like Alchemy or any other public Ethereum node provider
const rpcUrl = `https://site1.moralis-nodes.com/eth/${moralisAppId}`;

// Create a new Web3 instance
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

const getLatestBlockNumber = async (chainId = 1) => {
  const latestBlockNumber = await web3.eth.getBlockNumber();
  return Number(latestBlockNumber);
};

// Function to decode transaction logs using abi-decoder
const decodeTransactionLogs = async (contractAddress, txnHash) => {
  // Initialize the abi-decoder with the contract ABI
  abiDecoder.addABI(abi.v3);

  // Get the transaction receipt
  const receipt = await web3.eth.getTransactionReceipt(txnHash);

  if (!receipt) {
    throw new Error(`Transaction receipt not found for ${txnHash}`);
  }

  // Decode the logs using abi-decoder
  const decodedLogs = abiDecoder.decodeLogs(receipt.logs);

  // find a address matching the contract address

  const tokenSwapLogs = decodedLogs.filter((log) => {
    return (
      String(log.address).toLowerCase() ==
        String(contractAddress).toLowerCase() && log.name == "Swap"
    );
  });

  return tokenSwapLogs;
};

const getTokenDetails = async (tokenAddress) => {
  const tokenContract = new web3.eth.Contract(abi.erc20, tokenAddress);
  const tokenSymbol = await tokenContract.methods.symbol().call();
  const tokenDecimals = Number(await tokenContract.methods.decimals().call());

  return { tokenSymbol, tokenDecimals };
};

module.exports = {
  web3,
  getLatestBlockNumber,
  decodeTransactionLogs,
  getTokenDetails,
};
