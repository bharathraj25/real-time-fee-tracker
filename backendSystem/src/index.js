const express = require("express");
const morgan = require("morgan");
const { PORT } = require("./config.js");
var cors = require("cors");
const redisClient = require("./redis/client.js");
const bullmq = require("./bull/queues");

const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

redisClient.connect();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [
    new BullMQAdapter(bullmq.getHistoricalTxnsChildQueue),
    new BullMQAdapter(bullmq.getHistoricalTxnsParentQueue),
    new BullMQAdapter(bullmq.getLiveTxnsQueue),
    new BullMQAdapter(bullmq.getTxnsFromEtherscanQueue),
  ],
  serverAdapter: serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

const apiRoutes = require("./routes/api/index.js");
const apiDocsRoutes = require("./routes/apiDocs.js");

app.use("/health", (req, res) => {
  res.send("Healthy!");
});

app.use("/api", apiRoutes);
app.use("/api-docs", apiDocsRoutes);

app.get("/", (req, res) => {
  res.send("Hey Raj this side! Welcome to the API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
