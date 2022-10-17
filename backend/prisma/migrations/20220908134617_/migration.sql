/*
  Warnings:

  - You are about to drop the column `RefreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Token` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[AccessToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_RefreshToken_key";

-- DropIndex
DROP INDEX "User_Token_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "RefreshToken",
DROP COLUMN "Token",
ADD COLUMN     "AccessToken" TEXT,
ADD COLUMN     "Connected" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "User_AccessToken_key" ON "User"("AccessToken");
