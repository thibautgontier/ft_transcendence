/*
  Warnings:

  - You are about to drop the column `PlayerOneID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `PlayerTwoID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `WinnerID` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[PlayerOneID]` on the table `Party` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[PlayerTwoID]` on the table `Party` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[WinnerID]` on the table `Party` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_PlayerOneID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_PlayerTwoID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_WinnerID_fkey";

-- DropIndex
DROP INDEX "User_PlayerOneID_key";

-- DropIndex
DROP INDEX "User_PlayerTwoID_key";

-- DropIndex
DROP INDEX "User_WinnerID_key";

-- AlterTable
ALTER TABLE "Party" ADD COLUMN     "PlayerOneID" INTEGER,
ADD COLUMN     "PlayerTwoID" INTEGER,
ADD COLUMN     "WinnerID" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "PlayerOneID",
DROP COLUMN "PlayerTwoID",
DROP COLUMN "WinnerID";

-- CreateIndex
CREATE UNIQUE INDEX "Party_PlayerOneID_key" ON "Party"("PlayerOneID");

-- CreateIndex
CREATE UNIQUE INDEX "Party_PlayerTwoID_key" ON "Party"("PlayerTwoID");

-- CreateIndex
CREATE UNIQUE INDEX "Party_WinnerID_key" ON "Party"("WinnerID");

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_PlayerOneID_fkey" FOREIGN KEY ("PlayerOneID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_PlayerTwoID_fkey" FOREIGN KEY ("PlayerTwoID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_WinnerID_fkey" FOREIGN KEY ("WinnerID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
