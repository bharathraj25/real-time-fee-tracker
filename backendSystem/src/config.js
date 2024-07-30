require("dotenv").config();

const PORT = process.env.PORT || 3001;
const DOMAIN = process.env.DOMAIN || "localhost";

module.exports = {
  PORT,
  DOMAIN,
};
