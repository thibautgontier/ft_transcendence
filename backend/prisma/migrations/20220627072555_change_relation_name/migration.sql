/*
  Warnings:

  - You are about to drop the column `admins` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `messages` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `mutedUsers` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `users` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `history` on the `GameProfile` table. All the data in the column will be lost.
  - You are about to drop the column `party` on the `Matchs` table. All the data in the column will be lost.
  - You are about to drop the column `users` on the `Matchs` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `playerOne` on the `Party` table. All the data in the column will be lost.
  - You are about to drop the column `playerTwo` on the `Party` table. All the data in the column will be lost.
  - You are about to drop the column `winner` on the `Party` table. All the data in the column will be lost.
  - You are about to drop the column `blocked` on the `Social` table. All the data in the column will be lost.
  - You are about to drop the column `channels` on the `Social` table. All the data in the column will be lost.
  - You are about to drop the column `friends` on the `Social` table. All the data in the column will be lost.
  - You are about to drop the column `notifys` on the `Social` table. All the data in the column will be lost.
  - You are about to drop the column `gameProfile` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `social` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usersID]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerID]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adminsID]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mutedUsersID]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[messagesID]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usersID]` on the table `Matchs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[partyID]` on the table `Matchs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[playerOneID]` on the table `Party` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[playerTwoID]` on the table `Party` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[winnerID]` on the table `Party` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gameProfileID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[socialID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminsID` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerID` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usersID` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerOneID` to the `Party` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameProfileID` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialID` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_admins_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_messages_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_mutedUsers_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_owner_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_users_fkey";

-- DropForeignKey
ALTER TABLE "GameProfile" DROP CONSTRAINT "GameProfile_history_fkey";

-- DropForeignKey
ALTER TABLE "Matchs" DROP CONSTRAINT "Matchs_party_fkey";

-- DropForeignKey
ALTER TABLE "Matchs" DROP CONSTRAINT "Matchs_users_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_user_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_playerOne_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_playerTwo_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_winner_fkey";

-- DropForeignKey
ALTER TABLE "Social" DROP CONSTRAINT "Social_blocked_fkey";

-- DropForeignKey
ALTER TABLE "Social" DROP CONSTRAINT "Social_channels_fkey";

-- DropForeignKey
ALTER TABLE "Social" DROP CONSTRAINT "Social_friends_fkey";

-- DropForeignKey
ALTER TABLE "Social" DROP CONSTRAINT "Social_notifys_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_gameProfile_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_social_fkey";

-- DropIndex
DROP INDEX "Channel_admins_key";

-- DropIndex
DROP INDEX "Channel_messages_key";

-- DropIndex
DROP INDEX "Channel_mutedUsers_key";

-- DropIndex
DROP INDEX "Channel_owner_key";

-- DropIndex
DROP INDEX "Channel_users_key";

-- DropIndex
DROP INDEX "Matchs_party_key";

-- DropIndex
DROP INDEX "Matchs_users_key";

-- DropIndex
DROP INDEX "Message_user_key";

-- DropIndex
DROP INDEX "Party_playerOne_key";

-- DropIndex
DROP INDEX "Party_playerTwo_key";

-- DropIndex
DROP INDEX "Party_winner_key";

-- DropIndex
DROP INDEX "User_gameProfile_key";

-- DropIndex
DROP INDEX "User_social_key";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "admins",
DROP COLUMN "messages",
DROP COLUMN "mutedUsers",
DROP COLUMN "owner",
DROP COLUMN "users",
ADD COLUMN     "adminsID" INTEGER NOT NULL,
ADD COLUMN     "messagesID" INTEGER,
ADD COLUMN     "mutedUsersID" INTEGER,
ADD COLUMN     "ownerID" INTEGER NOT NULL,
ADD COLUMN     "usersID" INTEGER NOT NULL,
ALTER COLUMN "password" DROP DEFAULT;

-- AlterTable
ALTER TABLE "GameProfile" DROP COLUMN "history",
ADD COLUMN     "historyID" INTEGER;

-- AlterTable
ALTER TABLE "Matchs" DROP COLUMN "party",
DROP COLUMN "users",
ADD COLUMN     "partyID" INTEGER,
ADD COLUMN     "usersID" INTEGER;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "user",
ADD COLUMN     "userID" INTEGER NOT NULL,
ALTER COLUMN "content" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Notify" ALTER COLUMN "title" DROP DEFAULT,
ALTER COLUMN "content" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Party" DROP COLUMN "playerOne",
DROP COLUMN "playerTwo",
DROP COLUMN "winner",
ADD COLUMN     "playerOneID" INTEGER NOT NULL,
ADD COLUMN     "playerTwoID" INTEGER,
ADD COLUMN     "winnerID" INTEGER;

-- AlterTable
ALTER TABLE "Social" DROP COLUMN "blocked",
DROP COLUMN "channels",
DROP COLUMN "friends",
DROP COLUMN "notifys",
ADD COLUMN     "blockedID" INTEGER,
ADD COLUMN     "channelsID" INTEGER,
ADD COLUMN     "friendsID" INTEGER,
ADD COLUMN     "notifysID" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gameProfile",
DROP COLUMN "social",
ADD COLUMN     "gameProfileID" INTEGER NOT NULL,
ADD COLUMN     "socialID" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Channel_usersID_key" ON "Channel"("usersID");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_ownerID_key" ON "Channel"("ownerID");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_adminsID_key" ON "Channel"("adminsID");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_mutedUsersID_key" ON "Channel"("mutedUsersID");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_messagesID_key" ON "Channel"("messagesID");

-- CreateIndex
CREATE UNIQUE INDEX "Matchs_usersID_key" ON "Matchs"("usersID");

-- CreateIndex
CREATE UNIQUE INDEX "Matchs_partyID_key" ON "Matchs"("partyID");

-- CreateIndex
CREATE UNIQUE INDEX "Message_userID_key" ON "Message"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Party_playerOneID_key" ON "Party"("playerOneID");

-- CreateIndex
CREATE UNIQUE INDEX "Party_playerTwoID_key" ON "Party"("playerTwoID");

-- CreateIndex
CREATE UNIQUE INDEX "Party_winnerID_key" ON "Party"("winnerID");

-- CreateIndex
CREATE UNIQUE INDEX "User_gameProfileID_key" ON "User"("gameProfileID");

-- CreateIndex
CREATE UNIQUE INDEX "User_socialID_key" ON "User"("socialID");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_socialID_fkey" FOREIGN KEY ("socialID") REFERENCES "Social"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gameProfileID_fkey" FOREIGN KEY ("gameProfileID") REFERENCES "GameProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_friendsID_fkey" FOREIGN KEY ("friendsID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_blockedID_fkey" FOREIGN KEY ("blockedID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_channelsID_fkey" FOREIGN KEY ("channelsID") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_notifysID_fkey" FOREIGN KEY ("notifysID") REFERENCES "Notify"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameProfile" ADD CONSTRAINT "GameProfile_historyID_fkey" FOREIGN KEY ("historyID") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_playerOneID_fkey" FOREIGN KEY ("playerOneID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_playerTwoID_fkey" FOREIGN KEY ("playerTwoID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_winnerID_fkey" FOREIGN KEY ("winnerID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_usersID_fkey" FOREIGN KEY ("usersID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_adminsID_fkey" FOREIGN KEY ("adminsID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_mutedUsersID_fkey" FOREIGN KEY ("mutedUsersID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_messagesID_fkey" FOREIGN KEY ("messagesID") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matchs" ADD CONSTRAINT "Matchs_usersID_fkey" FOREIGN KEY ("usersID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matchs" ADD CONSTRAINT "Matchs_partyID_fkey" FOREIGN KEY ("partyID") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;
