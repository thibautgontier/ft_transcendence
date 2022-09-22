/*
  Warnings:

  - You are about to drop the column `AccessToken` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_AccessToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "AccessToken",
ADD COLUMN     "TwoFaCode" INTEGER;
