const express = require("express");
const { Queue: QueueMQ } = require("bullmq");
const Queue = require("bull");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");

require("dotenv").config();
console.log(process.env.REDIS_HOST);
const someQueue = new Queue("someQueueName", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
}); // if you have a special connection to redis.
const someOtherQueue = new Queue("someOtherQueueName", {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
}); // if you have a special connection to redis.
const queueMQ = new QueueMQ("queueMQName", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [
    new BullAdapter(someQueue),
    new BullAdapter(someOtherQueue),
    new BullMQAdapter(queueMQ),
  ],
  serverAdapter: serverAdapter,
});

const app = express();

app.use("/admin/queues", serverAdapter.getRouter());

// other configurations of your server

app.listen(3000, () => {
  console.log("Running on 3000...");
  console.log("For the UI, open http://localhost:3000/admin/queues");
  console.log("Make sure Redis is running on port 6379 by default");
});
