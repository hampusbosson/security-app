import { QUEUE_NAMES, redisConfig } from "./queueConfig";
import type { ScanJobPayload } from "./scanJobTypes";
import { Queue } from "bullmq";

export class ScanQueue {
  private static queue = new Queue<ScanJobPayload>(QUEUE_NAMES.SCAN, {
    connection: redisConfig,
  });

  static async addScanJob(payload: ScanJobPayload) {
    console.log("Adding scan job to queue:", payload);

    await this.queue.add("scan", payload, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    });
  }
}
