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

/**
 * @openapi
 * tags:
 *   - name: Job
 *     description: Operations related to jobs
 */

/**
 * @openapi
 * /api/job:
 *   get:
 *     tags:
 *       - Job
 *     summary: Get All Jobs
 *     description: Retrieve a list of all jobs with their detailed information.
 *     responses:
 *       200:
 *         description: A list of all jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "eth:mainnet:0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
 *                   data:
 *                     type: object
 *                     properties:
 *                       poolAddress:
 *                         type: string
 *                         example: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
 *                   opts:
 *                     type: object
 *                     properties:
 *                       attempts:
 *                         type: integer
 *                         example: 5
 *                       delay:
 *                         type: integer
 *                         example: 0
 *                       backoff:
 *                         type: object
 *                         properties:
 *                           delay:
 *                             type: integer
 *                             example: 2000
 *                           type:
 *                             type: string
 *                             example: "exponential"
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   progress:
 *                     type: number
 *                     format: float
 *                     example: 99.99998042285748
 *                   returnvalue:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *                   stacktrace:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: []
 *                   attemptsStarted:
 *                     type: integer
 *                     example: 12
 *                   attemptsMade:
 *                     type: integer
 *                     example: 0
 *                   delay:
 *                     type: integer
 *                     example: 0
 *                   timestamp:
 *                     type: integer
 *                     example: 1722480931608
 *                   queueQualifiedName:
 *                     type: string
 *                     example: "bull:getLiveTxns"
 *                   finishedOn:
 *                     type: integer
 *                     example: 1722494796072
 *                   processedOn:
 *                     type: integer
 *                     example: 1722493511344
 *                   failedReason:
 *                     type: string
 *                     example: "job stalled more than allowable limit"
 *       500:
 *         description: Internal server error
 */
router.get("/", jobController.getAllJobs);

/**
 * @openapi
 * /api/job/name/{jobName}:
 *   get:
 *     tags:
 *       - Job
 *     summary: Get Job Details by Name
 *     description: Retrieve details of a job specified by its name.
 *     parameters:
 *       - in: path
 *         name: jobName
 *         required: true
 *         description: The name of the job to retrieve details for.
 *         schema:
 *           type: string
 *           example: "eth:mainnet:0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "eth:mainnet:0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
 *                 data:
 *                   type: object
 *                   properties:
 *                     poolAddress:
 *                       type: string
 *                       example: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
 *                 opts:
 *                   type: object
 *                   properties:
 *                     attempts:
 *                       type: integer
 *                       example: 5
 *                     delay:
 *                       type: integer
 *                       example: 0
 *                     backoff:
 *                       type: object
 *                       properties:
 *                         delay:
 *                           type: integer
 *                           example: 2000
 *                         type:
 *                           type: string
 *                           example: "exponential"
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 progress:
 *                   type: number
 *                   format: float
 *                   example: 99.99998042285748
 *                 returnvalue:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 stacktrace:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: []
 *                 attemptsStarted:
 *                   type: integer
 *                   example: 12
 *                 attemptsMade:
 *                   type: integer
 *                   example: 0
 *                 delay:
 *                   type: integer
 *                   example: 0
 *                 timestamp:
 *                   type: integer
 *                   example: 1722480931608
 *                 queueQualifiedName:
 *                   type: string
 *                   example: "bull:getLiveTxns"
 *                 finishedOn:
 *                   type: integer
 *                   example: 1722494796072
 *                 processedOn:
 *                   type: integer
 *                   example: 1722493511344
 *                 failedReason:
 *                   type: string
 *                   example: "job stalled more than allowable limit"
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
router
  .route("/name/:jobName")
  .get(
    generateValidationMiddleware(jobSchemaByName, "params"),
    jobController.getJobDetailsByName
  );

/**
 * @openapi
 * /api/job/id/{jobId}:
 *   get:
 *     tags:
 *       - Job
 *     summary: Get Job Details By ID
 *     description: Retrieve job details based on the job ID.
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: The ID of the job.
 *         schema:
 *           type: string
 *           example: 1
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "eth:mainnet:0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
 *                 data:
 *                   type: object
 *                   properties:
 *                     poolAddress:
 *                       type: string
 *                       example: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
 *                 opts:
 *                   type: object
 *                   properties:
 *                     attempts:
 *                       type: integer
 *                       example: 5
 *                     delay:
 *                       type: integer
 *                       example: 0
 *                     backoff:
 *                       type: object
 *                       properties:
 *                         delay:
 *                           type: integer
 *                           example: 2000
 *                         type:
 *                           type: string
 *                           example: "exponential"
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 progress:
 *                   type: number
 *                   format: float
 *                   example: 99.99998042285748
 *                 returnvalue:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 stacktrace:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: []
 *                 attemptsStarted:
 *                   type: integer
 *                   example: 12
 *                 attemptsMade:
 *                   type: integer
 *                   example: 0
 *                 delay:
 *                   type: integer
 *                   example: 0
 *                 timestamp:
 *                   type: integer
 *                   example: 1722480931608
 *                 queueQualifiedName:
 *                   type: string
 *                   example: "bull:getLiveTxns"
 *                 finishedOn:
 *                   type: integer
 *                   example: 1722494796072
 *                 processedOn:
 *                   type: integer
 *                   example: 1722493511344
 *                 failedReason:
 *                   type: string
 *                   example: "job stalled more than allowable limit"
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
router
  .route("/id/:jobId")
  .get(
    generateValidationMiddleware(jobSchemaById, "params"),
    jobController.getJobDetailsById
  );

/**
 * @openapi
 * /api/job/{jobId}:
 *   delete:
 *     tags:
 *       - Job
 *     summary: Delete Job By ID
 *     description: Delete a job based on the job ID.
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: The ID of the job to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Job successfully deleted
 *       400:
 *         description: Invalid job ID supplied
 *       404:
 *         description: Job not found
 *     deprecated: true
 */
router
  .route("/:jobId")
  .delete(
    generateValidationMiddleware(jobSchemaById, "params"),
    jobController.getJobDetailsById
  );

/**
 * @openapi
 * /api/job/start:
 *   post:
 *     tags:
 *       - Job
 *     summary: Start a Job
 *     description: Start a job with the specified parameters.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               poolAddress:
 *                 type: string
 *                 example: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640'
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "eth:mainnet:0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
 *                 data:
 *                   type: object
 *                   properties:
 *                     poolAddress:
 *                       type: string
 *                       example: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
 *                 opts:
 *                   type: object
 *                   properties:
 *                     attempts:
 *                       type: integer
 *                       example: 5
 *                     delay:
 *                       type: integer
 *                       example: 0
 *                     backoff:
 *                       type: object
 *                       properties:
 *                         delay:
 *                           type: integer
 *                           example: 2000
 *                         type:
 *                           type: string
 *                           example: "exponential"
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 progress:
 *                   type: number
 *                   format: float
 *                   example: 99.99998042285748
 *                 returnvalue:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 stacktrace:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: []
 *                 attemptsStarted:
 *                   type: integer
 *                   example: 12
 *                 attemptsMade:
 *                   type: integer
 *                   example: 0
 *                 delay:
 *                   type: integer
 *                   example: 0
 *                 timestamp:
 *                   type: integer
 *                   example: 1722480931608
 *                 queueQualifiedName:
 *                   type: string
 *                   example: "bull:getLiveTxns"
 *                 finishedOn:
 *                   type: integer
 *                   example: 1722494796072
 *                 processedOn:
 *                   type: integer
 *                   example: 1722493511344
 *                 failedReason:
 *                   type: string
 *                   example: "job stalled more than allowable limit"
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
router
  .route("/start")
  .post(generateValidationMiddleware(jobSchemaStart), jobController.startJob);

module.exports = router;
