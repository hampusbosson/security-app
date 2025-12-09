import { Worker, Job } from "bullmq";
import { QUEUE_NAMES, redisConfig } from "../queue/queueConfig";
import type { ScanJobPayload } from "../queue/scanJobTypes";
import { handleScanJob } from "./handleScanJob";

const worker = new Worker<ScanJobPayload>(
  QUEUE_NAMES.SCAN,
  async (job: Job) => {
    console.log("Processing scan job:", job.data);
    await handleScanJob(job.data);
  },
  {
    connection: redisConfig,
    removeOnFail: { count: 0 },
    removeOnComplete: { count: 0 },
    concurrency: 1, // Process one job at a time 
  }
);

worker.on("error", (err) => {
  console.error(err);
});

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
