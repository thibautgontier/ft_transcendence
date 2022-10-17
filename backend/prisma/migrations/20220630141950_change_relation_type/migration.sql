/*
  Warnings:

  - The primary key for the `Channel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `Channel` table. All the data in the column will be lost.
  - The primary key for the `GameProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `GameProfile` table. All the data in the column will be lost.
  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `Message` table. All the data in the column will be lost.
  - The primary key for the `Notify` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `Notify` table. All the data in the column will be lost.
  - The primary key for the `Party` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `Party` table. All the data in the column will be lost.
  - The primary key for the `SocialProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `SocialProfile` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_ChannelNotifyID_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_SocialChannelID_fkey";

-- DropForeignKey
ALTER TABLE "GameProfile" DROP CONSTRAINT "GameProfile_UserId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_ChannelId_fkey";

-- DropForeignKey
ALTER TABLE "Notify" DROP CONSTRAINT "Notify_SocialNotifyID_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_GameHistoryID_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_PartyNotifyID_fkey";

-- DropForeignKey
ALTER TABLE "SocialProfile" DROP CONSTRAINT "SocialProfile_UserId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_BlockedID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_ChannelAdminID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_ChannelOwnerID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_ChannelUserID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_FriendID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_MutedUserID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_PlayerOneID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_PlayerTwoID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_UserMessageID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_UserNotifyID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_WinnerID_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Channel_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GameProfile" DROP CONSTRAINT "GameProfile_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "GameProfile_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Notify" DROP CONSTRAINT "Notify_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Notify_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Party" DROP CONSTRAINT "Party_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Party_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SocialProfile" DROP CONSTRAINT "SocialProfile_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "SocialProfile_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_PlayerOneID_fkey" FOREIGN KEY ("PlayerOneID") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_PlayerTwoID_fkey" FOREIGN KEY ("PlayerTwoID") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_WinnerID_fkey" FOREIGN KEY ("WinnerID") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_FriendID_fkey" FOREIGN KEY ("FriendID") REFERENCES "SocialProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_BlockedID_fkey" FOREIGN KEY ("BlockedID") REFERENCES "SocialProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_UserNotifyID_fkey" FOREIGN KEY ("UserNotifyID") REFERENCES "Notify"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ChannelUserID_fkey" FOREIGN KEY ("ChannelUserID") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ChannelOwnerID_fkey" FOREIGN KEY ("ChannelOwnerID") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ChannelAdminID_fkey" FOREIGN KEY ("ChannelAdminID") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_MutedUserID_fkey" FOREIGN KEY ("MutedUserID") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_UserMessageID_fkey" FOREIGN KEY ("UserMessageID") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameProfile" ADD CONSTRAINT "GameProfile_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_GameHistoryID_fkey" FOREIGN KEY ("GameHistoryID") REFERENCES "GameProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_PartyNotifyID_fkey" FOREIGN KEY ("PartyNotifyID") REFERENCES "Notify"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialProfile" ADD CONSTRAINT "SocialProfile_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notify" ADD CONSTRAINT "Notify_SocialNotifyID_fkey" FOREIGN KEY ("SocialNotifyID") REFERENCES "SocialProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_SocialChannelID_fkey" FOREIGN KEY ("SocialChannelID") REFERENCES "SocialProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_ChannelNotifyID_fkey" FOREIGN KEY ("ChannelNotifyID") REFERENCES "Notify"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_ChannelId_fkey" FOREIGN KEY ("ChannelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
