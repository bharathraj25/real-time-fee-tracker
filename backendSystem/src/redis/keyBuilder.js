const keyPrefixBuilder = (poolAddress, chain = "eth", network = "mainnet") => {
  return `${chain}:${network}:${poolAddress}`;
};

const keyBuilder = (
  poolAddress,
  attribute,
  chain = "eth",
  network = "mainnet"
) => {
  return `${keyPrefixBuilder(poolAddress, chain, network)}:${attribute}`;
};

const historyKeyBuilder = (
  poolAddress,
  startBlock,
  endBlock,
  chain = "eth",
  network = "mainnet"
) => {
  return `${keyPrefixBuilder(
    poolAddress,
    chain,
    network
  )}:history:${startBlock}:${endBlock}`;
};

module.exports = { keyBuilder, keyPrefixBuilder, historyKeyBuilder };
