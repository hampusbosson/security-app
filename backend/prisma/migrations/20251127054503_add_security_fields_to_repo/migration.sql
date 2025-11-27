-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "lastScan" TIMESTAMP(3),
ADD COLUMN     "securityScore" INTEGER;
