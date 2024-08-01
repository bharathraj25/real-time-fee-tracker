const abi = require("../../constants/uniswapABI");
const { HttpError } = require("../../errors.js");
const {
  web3,
  decodeTransactionLogs,
  getTokenDetails,
} = require("../../utils/web3Services.js");
const getExchangePrice = async (contractAddress, txnHash) => {
  try {
    const tokenSwapLogs = await decodeTransactionLogs(contractAddress, txnHash);

    if (tokenSwapLogs.length === 0) {
      throw new Error("No token swap logs found in the transaction.");
    }
    const tokenSwapLog = tokenSwapLogs[0];
    const decodedData = tokenSwapLog.events;

    const tokenContract = new web3.eth.Contract(abi.v3, contractAddress);

    const token0Address = await tokenContract.methods.token0().call();
    const { tokenSymbol: token0Symbol, tokenDecimals: token0Decimals } =
      await getTokenDetails(token0Address);
    const token0Amount = Number(
      decodedData.filter((data) => {
        return data.name == "amount0";
      })[0].value
    );

    const token1Address = await tokenContract.methods.token1().call();
    const { tokenSymbol: token1Symbol, tokenDecimals: token1Decimals } =
      await getTokenDetails(token1Address);

    const token1Amount = Number(
      decodedData.filter((data) => {
        return data.name == "amount1";
      })[0].value
    );

    const tokensRatio = token0Amount / token1Amount;
    const decimalDiff0 = token0Decimals - token1Decimals;
    const decimalDiff1 = token1Decimals - token0Decimals;

    const token0Value = Math.abs((1 / tokensRatio) * 10 ** decimalDiff0);
    const token1Value = Math.abs(tokensRatio * 10 ** decimalDiff1);

    let tokenIn = Number(token0Amount) < 0 ? token1Symbol : token0Symbol;

    const result = {
      txnSpecific: {
        tokenIn: tokenIn,
        tokenInAmount:
          Math.abs(tokenIn == token0Symbol ? token0Amount : token1Amount) /
          10 ** (tokenIn == token0Symbol ? token0Decimals : token1Decimals),
        tokenOut: tokenIn == token0Symbol ? token1Symbol : token0Symbol,
        tokenOutAmount:
          Math.abs(tokenIn == token0Symbol ? token1Amount : token0Amount) /
          10 ** (tokenIn == token0Symbol ? token1Decimals : token0Decimals),
        price: tokenIn == token0Symbol ? token0Value : token1Value,
        description: `Swaped with an exchange rate of 1 ${token1Symbol} = ${token1Value} ${token0Symbol}`,
      },
      exchangePrices: {
        [`${token0Symbol} -> ${token1Symbol}`]: `1 ${token0Symbol} = ${token0Value} ${token1Symbol}`,
        [`${token1Symbol} -> ${token0Symbol}`]: `1 ${token1Symbol} = ${token1Value} ${token0Symbol}`,
      },
    };

    return result;
  } catch (error) {
    throw new HttpError(error.code, error.message);
  }
};
module.exports = { getExchangePrice };
