import { QUEUE_NAMES, redisConfig } from "./queueConfig";
import type { ScanJobPayload } from "./scanJobTypes";
import { Queue } from "bullmq";

export class ScanQueue {
  private static queue = new Queue<ScanJobPayload>(QUEUE_NAMES.SCAN, {
    connection: redisConfig,
  });

  static async addScanJob(payload: ScanJobPayload) {
    console.log("Adding scan job to queue:", payload);

    const job = await this.queue.add("scan", payload, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    });
    
    return job.id;
  }

  static async removeScanJob(jobId: string) {
    const job = await this.queue.getJob(jobId);
    if (job) {
      await job.remove();
      console.log(`Removed scan job with ID: ${jobId}`);
    } else {
      console.log(`No job found with ID: ${jobId}`);
      return;
    }
  }
}
