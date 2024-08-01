const router = require("express").Router();
const jobController = require("../../../controllers/job");
const {
  generateValidationMiddleware,
} = require("../../../middlewares/validation");
const {
  jobSchemaStart,
  jobSchemaByName,
  jobSchemaById,
} = require("../../../schemas/jobSchema");

router.get("/", jobController.getAllJobs);
router
  .route("/name/:jobName")
  .get(
    generateValidationMiddleware(jobSchemaByName, "params"),
    jobController.getJobDetailsByName
  );
router
  .route("/id/:jobId")
  .get(
    generateValidationMiddleware(jobSchemaById, "params"),
    jobController.getJobDetailsById
  );
router
  .route("/:jobId")
  .delete(
    generateValidationMiddleware(jobSchemaById, "params"),
    jobController.getJobDetailsById
  );
router
  .route("/start")
  .put(generateValidationMiddleware(jobSchemaStart), jobController.startJob);

module.exports = router;
