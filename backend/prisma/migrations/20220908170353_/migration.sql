/*
  Warnings:

  - You are about to drop the column `GameHistoryID` on the `Party` table. All the data in the column will be lost.
  - You are about to drop the column `AccessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Connected` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `PlayerOneID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `PlayerTwoID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `UserMessageID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `WinnerID` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Token]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[RefreshToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `UserID` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `RefreshToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Token` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_ChannelID_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_GameHistoryID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_PlayerOneID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_PlayerTwoID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_UserMessageID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_WinnerID_fkey";

-- DropIndex
DROP INDEX "Message_ChannelID_key";

-- DropIndex
DROP INDEX "User_AccessToken_key";

-- DropIndex
DROP INDEX "User_PlayerOneID_key";

-- DropIndex
DROP INDEX "User_PlayerTwoID_key";

-- DropIndex
DROP INDEX "User_UserMessageID_key";

-- DropIndex
DROP INDEX "User_WinnerID_key";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "UserID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Party" DROP COLUMN "GameHistoryID",
ADD COLUMN     "PlayerOneID" INTEGER,
ADD COLUMN     "PlayerTwoID" INTEGER,
ADD COLUMN     "WinnerID" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "AccessToken",
DROP COLUMN "Connected",
DROP COLUMN "PlayerOneID",
DROP COLUMN "PlayerTwoID",
DROP COLUMN "UserMessageID",
DROP COLUMN "WinnerID",
ADD COLUMN     "RefreshToken" TEXT NOT NULL,
ADD COLUMN     "Token" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_history" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_banUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_history_AB_unique" ON "_history"("A", "B");

-- CreateIndex
CREATE INDEX "_history_B_index" ON "_history"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_banUser_AB_unique" ON "_banUser"("A", "B");

-- CreateIndex
CREATE INDEX "_banUser_B_index" ON "_banUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_Token_key" ON "User"("Token");

-- CreateIndex
CREATE UNIQUE INDEX "User_RefreshToken_key" ON "User"("RefreshToken");

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_PlayerOneID_fkey" FOREIGN KEY ("PlayerOneID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_PlayerTwoID_fkey" FOREIGN KEY ("PlayerTwoID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_WinnerID_fkey" FOREIGN KEY ("WinnerID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_ChannelID_fkey" FOREIGN KEY ("ChannelID") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_history" ADD CONSTRAINT "_history_A_fkey" FOREIGN KEY ("A") REFERENCES "GameProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_history" ADD CONSTRAINT "_history_B_fkey" FOREIGN KEY ("B") REFERENCES "Party"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_banUser" ADD CONSTRAINT "_banUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_banUser" ADD CONSTRAINT "_banUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
