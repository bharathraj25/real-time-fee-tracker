const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");
const { DOMAIN, PORT } = require("./config");

const swaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "Tokka Labs Challenge - Raj",
    version: "1.0.0",
    description: `Exercise: Get transaction fee in USDT for all Uniswap WETH-USDC Transactions.\n\nTo monitor jobs and transactions, please visit the following link:\n- [Bull Board](http://${DOMAIN}:${PORT}/admin/queues)`,
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "routes/api/**/*.js")],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = { swaggerSpec };
