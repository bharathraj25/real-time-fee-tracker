const { QueueGetters } = require("bullmq");
const { keyPrefixBuilder } = require("../../redis/keyBuilder");
const { getLiveTxnsQueue } = require("../../bull/queues");

// Initiate all the services for job
const getAllJobs = async (status = "active") => {
  // const jobs = await getLiveTxnsQueue.getJobCounts();
  const jobs = await getLiveTxnsQueue.getJobs();
  return jobs;
};

const getJobDetails = async (jobId) => {
  const job = await getLiveTxnsQueue.getJob(jobId);
  console.log(job);
  return job;
};

const deleteJob = async (jobId) => {
  const job = await getJobDetails(jobId);
  if (!job) {
    throw new Error("Job not found");
  }
  await job.remove();
};

const startJob = async (poolAddress) => {
  const jobId = keyPrefixBuilder(poolAddress);
  const job = getLiveTxnsQueue.add(jobId, {
    poolAddress,
  });
  return job;
};

module.exports = {
  getAllJobs,
  getJobDetails,
  deleteJob,
  startJob,
};
