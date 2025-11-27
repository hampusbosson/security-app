-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "branchProtectionEnabled" BOOLEAN DEFAULT false,
ADD COLUMN     "dependabotAlertCount" INTEGER DEFAULT 0,
ADD COLUMN     "lastCommit" TEXT,
ADD COLUMN     "openIssueCount" INTEGER,
ADD COLUMN     "openPrCount" INTEGER,
ADD COLUMN     "primaryLanguage" TEXT,
ADD COLUMN     "secretScanningEnabled" BOOLEAN DEFAULT false;
