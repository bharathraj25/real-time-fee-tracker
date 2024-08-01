const jobService = require("../../services/job");

const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.getAllJobs();
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

const getJobDetailsByName = async (req, res, next) => {
  try {
    const jobName = req.params.jobName;
    const job = await jobService.getJobDetailsByName(jobName);
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

const getJobDetailsById = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const job = await jobService.getJobDetailsById(jobId);
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    await jobService.deleteJob(jobId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const startJob = async (req, res, next) => {
  try {
    const { poolAddress } = req.body;
    const job = await jobService.startJob(poolAddress);
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJobs,
  getJobDetailsByName,
  getJobDetailsById,
  deleteJob,
  startJob,
};
