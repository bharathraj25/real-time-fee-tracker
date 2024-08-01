const router = require("express").Router();
const exchangePriceController = require("../../../controllers/exchangePrice");
const {
  generateValidationMiddleware,
} = require("../../../middlewares/validation");
const { exchangePriceSchema } = require("../../../schemas/exchangePriceSchema");

router
  .route("/txn")
  .get(
    generateValidationMiddleware(exchangePriceSchema, "query"),
    exchangePriceController.getExchangePrice
  );

module.exports = router;
