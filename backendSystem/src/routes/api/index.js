const express = require("express");
const router = express.Router();
const jobRoute = require("./job");

router.use("/job", jobRoute);

module.exports = router;
