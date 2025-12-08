export const QUEUE_NAMES = {
  SCAN: "scan-queue",
} as const;

// If you use BullMQ later, config for Redis would live here
export const redisConfig = {
  host: process.env.REDIS_HOST ?? "127.0.0.1",
  port: Number(process.env.REDIS_PORT ?? 6379),
};