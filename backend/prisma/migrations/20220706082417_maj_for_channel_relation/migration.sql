/*
  Warnings:

  - You are about to drop the column `ChannelAdminID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ChannelUserID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `MutedUserID` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_ChannelAdminID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_ChannelUserID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_MutedUserID_fkey";

-- DropIndex
DROP INDEX "User_ChannelAdminID_key";

-- DropIndex
DROP INDEX "User_ChannelUserID_key";

-- DropIndex
DROP INDEX "User_MutedUserID_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ChannelAdminID",
DROP COLUMN "ChannelUserID",
DROP COLUMN "MutedUserID";

-- CreateTable
CREATE TABLE "_chanUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_admin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_mutedUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_chanUsers_AB_unique" ON "_chanUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_chanUsers_B_index" ON "_chanUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_admin_AB_unique" ON "_admin"("A", "B");

-- CreateIndex
CREATE INDEX "_admin_B_index" ON "_admin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_mutedUser_AB_unique" ON "_mutedUser"("A", "B");

-- CreateIndex
CREATE INDEX "_mutedUser_B_index" ON "_mutedUser"("B");

-- AddForeignKey
ALTER TABLE "_chanUsers" ADD CONSTRAINT "_chanUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chanUsers" ADD CONSTRAINT "_chanUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_admin" ADD CONSTRAINT "_admin_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_admin" ADD CONSTRAINT "_admin_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mutedUser" ADD CONSTRAINT "_mutedUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mutedUser" ADD CONSTRAINT "_mutedUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
