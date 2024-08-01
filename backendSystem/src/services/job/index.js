const { keyPrefixBuilder } = require("../../redis/keyBuilder");
const { getLiveTxnsQueue } = require("../../bull/queues");
const { HttpError } = require("../../errors");
const { getRedisKey } = require("../../redis");

// Initiate all the services for job
const getAllJobs = async (status = "active") => {
  // const jobs = await getLiveTxnsQueue.getJobCounts();
  const jobs = await getLiveTxnsQueue.getJobs();
  return jobs;
};

const getJobDetailsByName = async (jobName) => {
  const jobId = await getRedisKey(jobName);
  if (!jobId) {
    throw new HttpError(404, "Job not found");
  }
  return await getJobDetailsById(jobId);
};

const getJobDetailsById = async (jobId) => {
  const job = await getLiveTxnsQueue.getJob(jobId);
  if (!job) {
    throw new HttpError(404, "Job not found");
  }
  return job;
};

const deleteJob = async (jobId) => {
  const job = await getJobDetailsById(jobId);
  if (!job) {
    throw new HttpError(404, "Job not found");
  }
  await job.remove();
};

const startJob = async (poolAddress) => {
  const jobId = keyPrefixBuilder(poolAddress);
  const job = await getLiveTxnsQueue.add(jobId, {
    poolAddress,
  });
  return job;
};

module.exports = {
  getAllJobs,
  getJobDetailsByName,
  getJobDetailsById,
  deleteJob,
  startJob,
};
