// TO RUN THIS SCRIPT: npx ts-node scripts/clearQueue.ts

import { Queue } from "bullmq";
import { redisConfig } from "../src/queue/queueConfig";

async function clear() {
  const queue = new Queue("scan-queue", { connection: redisConfig });

  // Get counts BEFORE
  const before = await queue.getJobCounts(
    "waiting",
    "delayed",
    "active",
    "failed",
    "completed"
  );

  console.log("Queue state BEFORE:");
  console.table(before);

  // Clear jobs
  console.log("Clearing waiting & delayed jobs...");
  await queue.drain(true);

  console.log("Clearing failed jobs...");
  await queue.clean(0, 0, "failed");

  // Get counts AFTER
  const after = await queue.getJobCounts(
    "waiting",
    "delayed",
    "active",
    "failed",
    "completed"
  );

  console.log("Queue state AFTER:");
  console.table(after);

  process.exit(0);
}

clear();