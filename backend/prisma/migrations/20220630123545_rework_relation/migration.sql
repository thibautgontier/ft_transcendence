/*
  Warnings:

  - The primary key for the `Channel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `adminsID` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `messagesID` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `mutedUsersID` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `ownerID` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `usersID` on the `Channel` table. All the data in the column will be lost.
  - The primary key for the `GameProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `historyID` on the `GameProfile` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `GameProfile` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `GameProfile` table. All the data in the column will be lost.
  - You are about to drop the column `nbParty` on the `GameProfile` table. All the data in the column will be lost.
  - You are about to drop the column `nbWin` on the `GameProfile` table. All the data in the column will be lost.
  - You are about to drop the column `xp` on the `GameProfile` table. All the data in the column will be lost.
  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `Message` table. All the data in the column will be lost.
  - The primary key for the `Notify` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `channelID` on the `Notify` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Notify` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Notify` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Notify` table. All the data in the column will be lost.
  - You are about to drop the column `partyID` on the `Notify` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Notify` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Notify` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `Notify` table. All the data in the column will be lost.
  - The primary key for the `Party` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Party` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Party` table. All the data in the column will be lost.
  - You are about to drop the column `playerOneID` on the `Party` table. All the data in the column will be lost.
  - You are about to drop the column `playerTwoID` on the `Party` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Party` table. All the data in the column will be lost.
  - You are about to drop the column `winnerID` on the `Party` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gameProfileID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `socialID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twoFA` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Matchs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Social` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[Name]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ChannelNotifyID]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[UserId]` on the table `GameProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ChannelId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[PartyNotifyID]` on the table `Party` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Nickname]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Token]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[RefreshToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[PlayerOneID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[PlayerTwoID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[WinnerID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ChannelUserID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ChannelOwnerID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ChannelAdminID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[MutedUserID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[UserNotifyID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[UserMessageID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `UpdatedAt` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `GameProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ChannelId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Content` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Content` to the `Notify` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Title` to the `Notify` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Type` to the `Notify` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Party` table without a default value. This is not possible if the table is not empty.
  - Added the required column `RefreshToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Token` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_adminsID_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_messagesID_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_mutedUsersID_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_ownerID_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_usersID_fkey";

-- DropForeignKey
ALTER TABLE "GameProfile" DROP CONSTRAINT "GameProfile_historyID_fkey";

-- DropForeignKey
ALTER TABLE "Matchs" DROP CONSTRAINT "Matchs_partyID_fkey";

-- DropForeignKey
ALTER TABLE "Matchs" DROP CONSTRAINT "Matchs_usersID_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userID_fkey";

-- DropForeignKey
ALTER TABLE "Notify" DROP CONSTRAINT "Notify_channelID_fkey";

-- DropForeignKey
ALTER TABLE "Notify" DROP CONSTRAINT "Notify_partyID_fkey";

-- DropForeignKey
ALTER TABLE "Notify" DROP CONSTRAINT "Notify_userID_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_playerOneID_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_playerTwoID_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_winnerID_fkey";

-- DropForeignKey
ALTER TABLE "Social" DROP CONSTRAINT "Social_blockedID_fkey";

-- DropForeignKey
ALTER TABLE "Social" DROP CONSTRAINT "Social_channelsID_fkey";

-- DropForeignKey
ALTER TABLE "Social" DROP CONSTRAINT "Social_friendsID_fkey";

-- DropForeignKey
ALTER TABLE "Social" DROP CONSTRAINT "Social_notifysID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_gameProfileID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_socialID_fkey";

-- DropIndex
DROP INDEX "Channel_adminsID_key";

-- DropIndex
DROP INDEX "Channel_messagesID_key";

-- DropIndex
DROP INDEX "Channel_mutedUsersID_key";

-- DropIndex
DROP INDEX "Channel_ownerID_key";

-- DropIndex
DROP INDEX "Channel_usersID_key";

-- DropIndex
DROP INDEX "Message_userID_key";

-- DropIndex
DROP INDEX "Notify_channelID_key";

-- DropIndex
DROP INDEX "Notify_partyID_key";

-- DropIndex
DROP INDEX "Notify_userID_key";

-- DropIndex
DROP INDEX "Party_playerOneID_key";

-- DropIndex
DROP INDEX "Party_playerTwoID_key";

-- DropIndex
DROP INDEX "Party_winnerID_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_gameProfileID_key";

-- DropIndex
DROP INDEX "User_nickname_key";

-- DropIndex
DROP INDEX "User_refreshToken_key";

-- DropIndex
DROP INDEX "User_socialID_key";

-- DropIndex
DROP INDEX "User_token_key";

-- AlterTable
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_pkey",
DROP COLUMN "adminsID",
DROP COLUMN "id",
DROP COLUMN "messagesID",
DROP COLUMN "mutedUsersID",
DROP COLUMN "ownerID",
DROP COLUMN "password",
DROP COLUMN "type",
DROP COLUMN "usersID",
ADD COLUMN     "ChannelNotifyID" INTEGER,
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Description" TEXT,
ADD COLUMN     "Id" SERIAL NOT NULL,
ADD COLUMN     "Name" TEXT,
ADD COLUMN     "Password" TEXT,
ADD COLUMN     "SocialChannelID" INTEGER,
ADD COLUMN     "Type" "channelType" NOT NULL DEFAULT E'private',
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Channel_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "GameProfile" DROP CONSTRAINT "GameProfile_pkey",
DROP COLUMN "historyID",
DROP COLUMN "id",
DROP COLUMN "level",
DROP COLUMN "nbParty",
DROP COLUMN "nbWin",
DROP COLUMN "xp",
ADD COLUMN     "Id" SERIAL NOT NULL,
ADD COLUMN     "Level" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "NbParty" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "NbWin" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "UserId" INTEGER NOT NULL,
ADD COLUMN     "Xp" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD CONSTRAINT "GameProfile_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
DROP COLUMN "content",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "userID",
ADD COLUMN     "ChannelId" INTEGER NOT NULL,
ADD COLUMN     "Content" TEXT NOT NULL,
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Id" SERIAL NOT NULL,
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "Notify" DROP CONSTRAINT "Notify_pkey",
DROP COLUMN "channelID",
DROP COLUMN "content",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "partyID",
DROP COLUMN "title",
DROP COLUMN "type",
DROP COLUMN "userID",
ADD COLUMN     "Content" TEXT NOT NULL,
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Id" SERIAL NOT NULL,
ADD COLUMN     "SocialNotifyID" INTEGER,
ADD COLUMN     "Title" TEXT NOT NULL,
ADD COLUMN     "Type" "notifyType" NOT NULL,
ADD CONSTRAINT "Notify_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "Party" DROP CONSTRAINT "Party_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "playerOneID",
DROP COLUMN "playerTwoID",
DROP COLUMN "status",
DROP COLUMN "winnerID",
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "GameHistoryID" INTEGER,
ADD COLUMN     "Id" SERIAL NOT NULL,
ADD COLUMN     "PartyNotifyID" INTEGER,
ADD COLUMN     "Status" "partyStatus" NOT NULL DEFAULT E'starting',
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Party_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "avatar",
DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "gameProfileID",
DROP COLUMN "id",
DROP COLUMN "nickname",
DROP COLUMN "refreshToken",
DROP COLUMN "socialID",
DROP COLUMN "status",
DROP COLUMN "token",
DROP COLUMN "twoFA",
DROP COLUMN "updatedAt",
ADD COLUMN     "Avatar" TEXT,
ADD COLUMN     "BlockedID" INTEGER,
ADD COLUMN     "ChannelAdminID" INTEGER,
ADD COLUMN     "ChannelOwnerID" INTEGER,
ADD COLUMN     "ChannelUserID" INTEGER,
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Email" TEXT,
ADD COLUMN     "FriendID" INTEGER,
ADD COLUMN     "Id" SERIAL NOT NULL,
ADD COLUMN     "MutedUserID" INTEGER,
ADD COLUMN     "Nickname" TEXT,
ADD COLUMN     "PlayerOneID" INTEGER,
ADD COLUMN     "PlayerTwoID" INTEGER,
ADD COLUMN     "RefreshToken" TEXT NOT NULL,
ADD COLUMN     "Status" "logStatus" NOT NULL DEFAULT E'offline',
ADD COLUMN     "Token" TEXT NOT NULL,
ADD COLUMN     "TwoFA" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "UserMessageID" INTEGER,
ADD COLUMN     "UserNotifyID" INTEGER,
ADD COLUMN     "WinnerID" INTEGER,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("Id");

-- DropTable
DROP TABLE "Matchs";

-- DropTable
DROP TABLE "Social";

-- CreateTable
CREATE TABLE "SocialProfile" (
    "Id" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "SocialProfile_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocialProfile_UserId_key" ON "SocialProfile"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_Name_key" ON "Channel"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_ChannelNotifyID_key" ON "Channel"("ChannelNotifyID");

-- CreateIndex
CREATE UNIQUE INDEX "GameProfile_UserId_key" ON "GameProfile"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_ChannelId_key" ON "Message"("ChannelId");

-- CreateIndex
CREATE UNIQUE INDEX "Party_PartyNotifyID_key" ON "Party"("PartyNotifyID");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "User_Nickname_key" ON "User"("Nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_Token_key" ON "User"("Token");

-- CreateIndex
CREATE UNIQUE INDEX "User_RefreshToken_key" ON "User"("RefreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_PlayerOneID_key" ON "User"("PlayerOneID");

-- CreateIndex
CREATE UNIQUE INDEX "User_PlayerTwoID_key" ON "User"("PlayerTwoID");

-- CreateIndex
CREATE UNIQUE INDEX "User_WinnerID_key" ON "User"("WinnerID");

-- CreateIndex
CREATE UNIQUE INDEX "User_ChannelUserID_key" ON "User"("ChannelUserID");

-- CreateIndex
CREATE UNIQUE INDEX "User_ChannelOwnerID_key" ON "User"("ChannelOwnerID");

-- CreateIndex
CREATE UNIQUE INDEX "User_ChannelAdminID_key" ON "User"("ChannelAdminID");

-- CreateIndex
CREATE UNIQUE INDEX "User_MutedUserID_key" ON "User"("MutedUserID");

-- CreateIndex
CREATE UNIQUE INDEX "User_UserNotifyID_key" ON "User"("UserNotifyID");

-- CreateIndex
CREATE UNIQUE INDEX "User_UserMessageID_key" ON "User"("UserMessageID");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_PlayerOneID_fkey" FOREIGN KEY ("PlayerOneID") REFERENCES "Party"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_PlayerTwoID_fkey" FOREIGN KEY ("PlayerTwoID") REFERENCES "Party"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_WinnerID_fkey" FOREIGN KEY ("WinnerID") REFERENCES "Party"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_FriendID_fkey" FOREIGN KEY ("FriendID") REFERENCES "SocialProfile"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_BlockedID_fkey" FOREIGN KEY ("BlockedID") REFERENCES "SocialProfile"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_UserNotifyID_fkey" FOREIGN KEY ("UserNotifyID") REFERENCES "Notify"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ChannelUserID_fkey" FOREIGN KEY ("ChannelUserID") REFERENCES "Channel"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ChannelOwnerID_fkey" FOREIGN KEY ("ChannelOwnerID") REFERENCES "Channel"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ChannelAdminID_fkey" FOREIGN KEY ("ChannelAdminID") REFERENCES "Channel"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_MutedUserID_fkey" FOREIGN KEY ("MutedUserID") REFERENCES "Channel"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_UserMessageID_fkey" FOREIGN KEY ("UserMessageID") REFERENCES "Message"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameProfile" ADD CONSTRAINT "GameProfile_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_GameHistoryID_fkey" FOREIGN KEY ("GameHistoryID") REFERENCES "GameProfile"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_PartyNotifyID_fkey" FOREIGN KEY ("PartyNotifyID") REFERENCES "Notify"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialProfile" ADD CONSTRAINT "SocialProfile_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notify" ADD CONSTRAINT "Notify_SocialNotifyID_fkey" FOREIGN KEY ("SocialNotifyID") REFERENCES "SocialProfile"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_SocialChannelID_fkey" FOREIGN KEY ("SocialChannelID") REFERENCES "SocialProfile"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_ChannelNotifyID_fkey" FOREIGN KEY ("ChannelNotifyID") REFERENCES "Notify"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_ChannelId_fkey" FOREIGN KEY ("ChannelId") REFERENCES "Channel"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
