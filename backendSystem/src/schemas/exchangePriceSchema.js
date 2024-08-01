const Joi = require("joi");

// Define the validation schema
const exchangePriceSchema = Joi.object({
  txnHash: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{64}$/)
    .required(),
  poolAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required(),
});

module.exports = {
  exchangePriceSchema,
};
