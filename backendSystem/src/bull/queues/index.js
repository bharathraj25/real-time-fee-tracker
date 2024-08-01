const {
  getHistoricalTxnsParentQueue,
  getHistoricalTxnsParentWorker,
  getHistoricalTxnsChildQueue,
  getHistoricalTxnsChildWorker,
} = require("./getHistoricalTxns");
const {
  getTxnsFromEtherscanQueue,
  getTxnsFromEtherscanWorker,
} = require("./getEtherscanTxns");
const { getLiveTxnsQueue, getLiveTxnsWorker } = require("./getLiveTxns");
const { persistTxnsQueue, persistTxnsWorker } = require("./persistTxns");
const { priceFeedQueue, priceFeedWorker } = require("./priceFeeder");

// getHistoricalTxnsWorker.run();
// getTxnsFromEtherscanWorker.run();
// getLiveTxnsWorker.run();

module.exports = {
  getHistoricalTxnsParentQueue,
  getHistoricalTxnsParentWorker,
  getHistoricalTxnsChildQueue,
  getHistoricalTxnsChildWorker,
  getTxnsFromEtherscanQueue,
  getTxnsFromEtherscanWorker,
  getLiveTxnsQueue,
  getLiveTxnsWorker,
  persistTxnsQueue,
  persistTxnsWorker,
  priceFeedQueue,
  priceFeedWorker,
};
