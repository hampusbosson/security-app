import { Queue } from "bullmq";
import { redisConfig } from "../src/queue/queueConfig";

async function clear() {
  const queue = new Queue("scan-queue", { connection: redisConfig });

  console.log("Clearing waiting and delayed jobs...");
  await queue.drain(true);

  console.log("Clearing failed jobs...");
  await queue.clean(0, 0, "failed");

  console.log("Queue cleared!");
  process.exit(0);
}

clear();