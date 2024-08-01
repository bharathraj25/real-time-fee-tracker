const router = require("express").Router();
const exchangePriceController = require("../../../controllers/exchangePrice");
const {
  generateValidationMiddleware,
} = require("../../../middlewares/validation");
const { exchangePriceSchema } = require("../../../schemas/exchangePriceSchema");

/**
 * @openapi
 * tags:
 *   - name: ExchangePrice
 *     description: Operations related to exchange price
 */

/**
 * @openapi
 * /api/exchangePrice/txn:
 *   get:
 *     tags:
 *       - ExchangePrice
 *     summary: Get Exchange Price
 *     description: Retrieve the exchange price details based on transaction hash and pool address.
 *     parameters:
 *       - name: txnHash
 *         in: query
 *         required: true
 *         description: The transaction hash to retrieve the exchange price.
 *         schema:
 *           type: string
 *           example: "0xc66807763041822396ad5877760ea5ae003d0ece7b715a1dc16dac476a5fd042"
 *       - name: poolAddress
 *         in: query
 *         required: true
 *         description: The pool address for which to retrieve the exchange price.
 *         schema:
 *           type: string
 *           example: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
 *     responses:
 *       200:
 *         description: Exchange price details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 txnSpecific:
 *                   type: object
 *                   properties:
 *                     tokenIn:
 *                       type: string
 *                       example: "WETH"
 *                     tokenInAmount:
 *                       type: integer
 *                       example: 0.5007329421833578
 *                     tokenOut:
 *                       type: string
 *                       example: "USDC"
 *                     tokenOutAmount:
 *                       type: integer
 *                       example: 1590.317083
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 3175.978548696441
 *                     description:
 *                       type: string
 *                       example: "Swaped with an exchange rate of 1 WETH = 3175.978548696441 USDC"
 *                 exchangePrices:
 *                   type: object
 *                   properties:
 *                     "USDC -> WETH":
 *                       type: string
 *                       example: "1 USDC = 0.00031486358760528883 WETH"
 *                     "WETH -> USDC":
 *                       type: string
 *                       example: "1 WETH = 3175.978548696441 USDC"
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
router
  .route("/txn")
  .get(
    generateValidationMiddleware(exchangePriceSchema, "query"),
    exchangePriceController.getExchangePrice
  );

module.exports = router;
