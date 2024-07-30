const router = require("express").Router();
const jobController = require("../../../controllers/job");

router.get("/", jobController.getAllJobs);
router.get("/:jobId", jobController.getJobDetails);
router.delete("/:jobId", jobController.deleteJob);
router.put("/start", jobController.startJob);

module.exports = router;