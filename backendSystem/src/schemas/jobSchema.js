const Joi = require("joi");

// Define the validation schema
const jobSchemaStart = Joi.object({
  poolAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required(),
});

const jobSchemaById = Joi.object({
  jobId: Joi.number().required(),
});

const jobSchemaByName = Joi.object({
  jobName: Joi.string().required(),
});

module.exports = {
  jobSchemaStart,
  jobSchemaById,
  jobSchemaByName,
};
