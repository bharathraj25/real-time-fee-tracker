const exchangePriceService = require("../../services/exchangePrice");

const getExchangePrice = async (req, res, next) => {
  try {
    const { txnHash, poolAddress } = req.query;
    const priceDetails = await exchangePriceService.getExchangePrice(
      poolAddress,
      txnHash
    );
    res.status(200).json(priceDetails);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExchangePrice,
};
