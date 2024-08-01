const express = require("express");
const router = express.Router();
const jobRoute = require("./job");
const exchangePriceRoute = require("./exchangePrice");

router.use("/job", jobRoute);
router.use("/exchangePrice", exchangePriceRoute);

module.exports = router;
