/*
  Warnings:

  - You are about to drop the column `UserId` on the `GameProfile` table. All the data in the column will be lost.
  - You are about to drop the column `ChannelId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `UserId` on the `SocialProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[UserID]` on the table `GameProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ChannelID]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[UserID]` on the table `SocialProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ChannelID` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GameProfile" DROP CONSTRAINT "GameProfile_UserId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_ChannelId_fkey";

-- DropForeignKey
ALTER TABLE "SocialProfile" DROP CONSTRAINT "SocialProfile_UserId_fkey";

-- DropIndex
DROP INDEX "GameProfile_UserId_key";

-- DropIndex
DROP INDEX "Message_ChannelId_key";

-- DropIndex
DROP INDEX "SocialProfile_UserId_key";

-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "Type" SET DEFAULT 'public';

-- AlterTable
ALTER TABLE "GameProfile" DROP COLUMN "UserId",
ADD COLUMN     "UserID" INTEGER;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "ChannelId",
ADD COLUMN     "ChannelID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SocialProfile" DROP COLUMN "UserId",
ADD COLUMN     "UserID" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "GameProfile_UserID_key" ON "GameProfile"("UserID");

-- CreateIndex
CREATE UNIQUE INDEX "Message_ChannelID_key" ON "Message"("ChannelID");

-- CreateIndex
CREATE UNIQUE INDEX "SocialProfile_UserID_key" ON "SocialProfile"("UserID");

-- AddForeignKey
ALTER TABLE "GameProfile" ADD CONSTRAINT "GameProfile_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialProfile" ADD CONSTRAINT "SocialProfile_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_ChannelID_fkey" FOREIGN KEY ("ChannelID") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
