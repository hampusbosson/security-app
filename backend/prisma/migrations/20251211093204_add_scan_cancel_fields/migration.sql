-- AlterTable
ALTER TABLE "Scan" ADD COLUMN     "bullJobId" TEXT,
ADD COLUMN     "cancelRequested" BOOLEAN NOT NULL DEFAULT false;
