/*
  Warnings:

  - You are about to drop the column `ChannelOwnerID` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ChannelOwnerID]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_ChannelOwnerID_fkey";

-- DropIndex
DROP INDEX "User_ChannelOwnerID_key";

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "ChannelOwnerID" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ChannelOwnerID";

-- CreateIndex
CREATE UNIQUE INDEX "Channel_ChannelOwnerID_key" ON "Channel"("ChannelOwnerID");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_ChannelOwnerID_fkey" FOREIGN KEY ("ChannelOwnerID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
