const { describe, it, expect } = require("@jest/globals");
const jobController = require("../../src/controllers/job");
const jobServices = require("../../src/services/job");

describe("jobController:getAllJobs", () => {
  it("should go to next middleware if there is an error", async () => {
    const req = {
      params: {},
    };
    const res = {};
    const next = jest.fn();

    const errInstance = new Error("Bad Request");
    jest.spyOn(jobServices, "getAllJobs").mockRejectedValue(errInstance);
    await jobController.getAllJobs(req, res, next);
    expect(next).toHaveBeenCalledWith(errInstance);
  });

  it("should send a list of all jobs", async () => {
    const req = {
      params: {},
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jest.spyOn(jobServices, "getAllJobs").mockResolvedValue([]);
    await jobController.getAllJobs(req, res, next);
    expect(res.json).toHaveBeenCalledWith([]);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("jobController:getJobDetailsByName", () => {
  it("should go to next middleware if there is an error", async () => {
    const req = {
      params: { jobName: "test" },
    };
    const res = {};
    const next = jest.fn();

    const errInstance = new Error("Bad Request");
    jest
      .spyOn(jobServices, "getJobDetailsByName")
      .mockRejectedValue(errInstance);
    await jobController.getJobDetailsByName(req, res, next);
    expect(next).toHaveBeenCalledWith(errInstance);
  });

  it("should send a job details by name", async () => {
    const req = {
      params: { jobName: "test" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jest.spyOn(jobServices, "getJobDetailsByName").mockResolvedValue({});
    await jobController.getJobDetailsByName(req, res, next);
    expect(res.json).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("jobController:getJobDetailsById", () => {
  it("should go to next middleware if there is an error", async () => {
    const req = {
      params: { jobId: "test" },
    };
    const res = {};
    const next = jest.fn();

    const errInstance = new Error("Bad Request");
    jest.spyOn(jobServices, "getJobDetailsById").mockRejectedValue(errInstance);
    await jobController.getJobDetailsById(req, res, next);
    expect(next).toHaveBeenCalledWith(errInstance);
  });

  it("should send a job details by id", async () => {
    const req = {
      params: { jobId: "test" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jest.spyOn(jobServices, "getJobDetailsById").mockResolvedValue({});
    await jobController.getJobDetailsById(req, res, next);
    expect(res.json).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("jobController:deleteJob", () => {
  it("should go to next middleware if there is an error", async () => {
    const req = {
      params: { jobId: "test" },
    };
    const res = {};
    const next = jest.fn();

    const errInstance = new Error("Bad Request");
    jest.spyOn(jobServices, "deleteJob").mockRejectedValue(errInstance);
    await jobController.deleteJob(req, res, next);
    expect(next).toHaveBeenCalledWith(errInstance);
  });

  it("should delete a job", async () => {
    const req = {
      params: { jobId: "test" },
    };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();

    jest.spyOn(jobServices, "deleteJob").mockResolvedValue();
    await jobController.deleteJob(req, res, next);
    expect(res.send).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
  });
});

describe("jobController:startJob", () => {
  it("should go to next middleware if there is an error", async () => {
    const req = {
      body: { poolAddress: "test" },
    };
    const res = {};
    const next = jest.fn();

    const errInstance = new Error("Bad Request");
    jest.spyOn(jobServices, "startJob").mockRejectedValue(errInstance);
    await jobController.startJob(req, res, next);
    expect(next).toHaveBeenCalledWith(errInstance);
  });

  it("should start a job", async () => {
    const req = {
      body: { poolAddress: "test" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jest.spyOn(jobServices, "startJob").mockResolvedValue({});
    await jobController.startJob(req, res, next);
    expect(res.json).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
