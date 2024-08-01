const { describe, it, expect } = require("@jest/globals");
const { keyPrefixBuilder } = require("../../src/redis/keyBuilder");
const { getLiveTxnsQueue } = require("../../src//bull/queues");
const { HttpError } = require("../../src/errors");
const { getRedisKey } = require("../../src/redis");

const {
  getAllJobs,
  getJobDetailsByName,
  getJobDetailsById,
  deleteJob,
  startJob,
} = require("../../src/services/job");

// Mock dependencies
jest.mock("../../src/redis/keyBuilder");
jest.mock("../../src/bull/queues");
jest.mock("../../src/errors", () => ({
  HttpError: class extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));
jest.mock("../../src/redis");

describe("Job Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllJobs", () => {
    it("should return all jobs with the default status", async () => {
      const mockJobs = [{ id: 1 }, { id: 2 }];
      getLiveTxnsQueue.getJobs.mockResolvedValue(mockJobs);

      const jobs = await getAllJobs();

      expect(jobs).toEqual(mockJobs);
      expect(getLiveTxnsQueue.getJobs).toHaveBeenCalled();
    });

    it("should handle errors when retrieving jobs", async () => {
      getLiveTxnsQueue.getJobs.mockRejectedValue(
        new Error("Failed to get jobs")
      );

      await expect(getAllJobs()).rejects.toThrow("Failed to get jobs");
    });
  });

  describe("getJobDetailsByName", () => {
    it("should return job details by name", async () => {
      const mockJob = { id: 1, name: "job1" };
      getRedisKey.mockResolvedValue(1);
      getLiveTxnsQueue.getJob.mockResolvedValue(mockJob);

      const job = await getJobDetailsByName("job1");

      expect(job).toEqual(mockJob);
      expect(getRedisKey).toHaveBeenCalledWith("job1");
      expect(getLiveTxnsQueue.getJob).toHaveBeenCalledWith(1);
    });

    it("should throw an error if job is not found by name", async () => {
      getRedisKey.mockResolvedValue(null);

      await expect(getJobDetailsByName("job1")).rejects.toThrow(HttpError);
      await expect(getJobDetailsByName("job1")).rejects.toHaveProperty(
        "statusCode",
        404
      );
      await expect(getJobDetailsByName("job1")).rejects.toHaveProperty(
        "message",
        "Job not found"
      );
    });

    it("should handle errors when retrieving job by name", async () => {
      getRedisKey.mockRejectedValue(new Error("Failed to get job key"));

      await expect(getJobDetailsByName("job1")).rejects.toThrow(
        "Failed to get job key"
      );
    });
  });

  describe("getJobDetailsById", () => {
    it("should return job details by id", async () => {
      const mockJob = { id: 1, name: "job1" };
      getLiveTxnsQueue.getJob.mockResolvedValue(mockJob);

      const job = await getJobDetailsById(1);

      expect(job).toEqual(mockJob);
      expect(getLiveTxnsQueue.getJob).toHaveBeenCalledWith(1);
    });

    it("should throw an error if job is not found by id", async () => {
      getLiveTxnsQueue.getJob.mockResolvedValue(null);

      await expect(getJobDetailsById(1)).rejects.toThrow(HttpError);
      await expect(getJobDetailsById(1)).rejects.toHaveProperty(
        "statusCode",
        404
      );
      await expect(getJobDetailsById(1)).rejects.toHaveProperty(
        "message",
        "Job not found"
      );
    });

    it("should handle errors when retrieving job by id", async () => {
      getLiveTxnsQueue.getJob.mockRejectedValue(new Error("Failed to get job"));

      await expect(getJobDetailsById(1)).rejects.toThrow("Failed to get job");
    });
  });

  describe("deleteJob", () => {
    it("should delete a job by id", async () => {
      const mockJob = { id: 1, remove: jest.fn() };
      getLiveTxnsQueue.getJob.mockResolvedValue(mockJob);

      await deleteJob(1);

      expect(getLiveTxnsQueue.getJob).toHaveBeenCalledWith(1);
      expect(mockJob.remove).toHaveBeenCalled();
    });

    it("should throw an error if job is not found for deletion", async () => {
      getLiveTxnsQueue.getJob.mockResolvedValue(null);

      await expect(deleteJob(1)).rejects.toThrow(HttpError);
      await expect(deleteJob(1)).rejects.toHaveProperty("statusCode", 404);
      await expect(deleteJob(1)).rejects.toHaveProperty(
        "message",
        "Job not found"
      );
    });

    it("should handle errors when deleting a job", async () => {
      getLiveTxnsQueue.getJob.mockRejectedValue(new Error("Failed to get job"));

      await expect(deleteJob(1)).rejects.toThrow("Failed to get job");
    });
  });

  describe("startJob", () => {
    it("should start a job with the given pool address", async () => {
      const mockJob = { id: 1, poolAddress: "pool1" };
      keyPrefixBuilder.mockReturnValue("job1");
      getLiveTxnsQueue.add.mockResolvedValue(mockJob);

      const job = await startJob("pool1");

      expect(job).toEqual(mockJob);
      expect(keyPrefixBuilder).toHaveBeenCalledWith("pool1");
      expect(getLiveTxnsQueue.add).toHaveBeenCalledWith("job1", {
        poolAddress: "pool1",
      });
    });

    it("should handle errors when starting a job", async () => {
      keyPrefixBuilder.mockReturnValue("job1");
      getLiveTxnsQueue.add.mockRejectedValue(new Error("Failed to add job"));

      await expect(startJob("pool1")).rejects.toThrow("Failed to add job");
    });
  });
});
