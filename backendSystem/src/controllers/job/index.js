const jobService = require("../../services/job");

const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobService.getAllJobs();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getJobDetails = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await jobService.getJobDetails(jobId);
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    await jobService.deleteJob(jobId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const startJob = async (req, res) => {
  try {
    const job = await jobService.startJob();
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  getAllJobs,
  getJobDetails,
  deleteJob,
  startJob,
};
