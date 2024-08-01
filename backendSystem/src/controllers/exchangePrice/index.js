const exchangePriceService = require("../../services/exchangePrice");

const getExchangePrice = async (req, res, next) => {
  try {
    const { txnHash, poolAddress } = req.query;
    const price = await exchangePriceService.getExchangePrice(
      poolAddress,
      txnHash
    );
    res.status(200).json(price);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExchangePrice,
};
