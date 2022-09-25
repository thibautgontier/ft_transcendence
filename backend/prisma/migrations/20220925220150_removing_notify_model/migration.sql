/*
  Warnings:

  - You are about to drop the column `ChannelNotifyID` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `PartyNotifyID` on the `Party` table. All the data in the column will be lost.
  - You are about to drop the column `UserNotifyID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Notify` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_ChannelNotifyID_fkey";

-- DropForeignKey
ALTER TABLE "Notify" DROP CONSTRAINT "Notify_SocialNotifyID_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_PartyNotifyID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_UserNotifyID_fkey";

-- DropIndex
DROP INDEX "Channel_ChannelNotifyID_key";

-- DropIndex
DROP INDEX "Party_PartyNotifyID_key";

-- DropIndex
DROP INDEX "User_UserNotifyID_key";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "ChannelNotifyID";

-- AlterTable
ALTER TABLE "Party" DROP COLUMN "PartyNotifyID";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "UserNotifyID";

-- DropTable
DROP TABLE "Notify";
