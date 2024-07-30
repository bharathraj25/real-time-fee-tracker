const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "Tokka Labs Challenge - Raj",
    version: "1.0.0",
    description:
      "Exercise: Get transaction fee in USDT for all Uniswap WETH-USDC Transactions.",
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
