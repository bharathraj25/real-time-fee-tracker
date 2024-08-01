const { HttpError } = require("../errors");
const joi = require("joi");
const { Prisma } = require("@prisma/client");
// ERROR HANDLING MIDDLEWARE
// here handle all the errors,
// either coming from the routes/controllers/services
// like joi validation, prisma query errors or custom http errors
function errorHandlingMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  if (err.constructor === joi.ValidationError) {
    return res.status(400).json({ message: "Bad Request - " + err.message });
  }
  if (err.constructor instanceof Prisma.constructor) {
    if (/2\d{3}/g.exec(err.code)) {
      return res
        .status(500)
        .json({ message: "Internal Server Error - Query Engine Went Wrong" });
    } else if (/1\d{3}/g.exec(err.code)) {
      return res
        .status(400)
        .json({ message: "Bad Request - Invalid Inputs" + err.message });
    }
  }
  switch (err.constructor) {
    case joi.ValidationError: {
      return res.status(400).json({ message: "Bad Request - " + err.message });
    }
    case HttpError: {
      return res.status(err.code).json({ message: err.message });
    }
    default: {
      res
        .status(500)
        .json({ message: "Internal Server Error - Something Went Wrong" });
    }
  }
}
module.exports = {
  errorHandlingMiddleware,
};
