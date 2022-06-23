/*
  Warnings:

  - The values [disconnected] on the enum `logStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "logStatus_new" AS ENUM ('online', 'offline', 'doNotDistrub', 'AFK', 'invisible', 'inGame');
ALTER TABLE "User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "status" TYPE "logStatus_new" USING ("status"::text::"logStatus_new");
ALTER TYPE "logStatus" RENAME TO "logStatus_old";
ALTER TYPE "logStatus_new" RENAME TO "logStatus";
DROP TYPE "logStatus_old";
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'offline';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT E'offline';
