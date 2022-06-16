-- CreateEnum
CREATE TYPE "logStatus" AS ENUM ('online', 'disconnected', 'doNotDistrub', 'AFK', 'invisible', 'inGame');

-- CreateEnum
CREATE TYPE "partyStatus" AS ENUM ('starting', 'running', 'finish');

-- CreateEnum
CREATE TYPE "channelType" AS ENUM ('private', 'protected', 'public');

-- CreateEnum
CREATE TYPE "notifyType" AS ENUM ('newMessage', 'playRequest', 'friendRequest');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "avatar" TEXT DEFAULT E'',
    "status" "logStatus" NOT NULL DEFAULT E'disconnected',
    "twoFA" BOOLEAN NOT NULL DEFAULT false,
    "game" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Social" (
    "id" SERIAL NOT NULL,
    "channels" INTEGER,
    "friends" INTEGER,
    "blocked" INTEGER,
    "notifys" INTEGER,
    "users" INTEGER,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameProfile" (
    "id" SERIAL NOT NULL,
    "level" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "xp" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nbParty" INTEGER NOT NULL DEFAULT 0,
    "nbWin" INTEGER NOT NULL DEFAULT 0,
    "history" INTEGER,

    CONSTRAINT "GameProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playerOne" INTEGER NOT NULL,
    "playerTwo" INTEGER,
    "winner" INTEGER,
    "status" "partyStatus" NOT NULL DEFAULT E'starting',

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "type" "channelType" NOT NULL DEFAULT E'private',
    "users" INTEGER NOT NULL,
    "owner" INTEGER NOT NULL,
    "admins" INTEGER NOT NULL,
    "mutedUsers" INTEGER,
    "messages" INTEGER,
    "password" TEXT DEFAULT E'',

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notify" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT E'',
    "content" TEXT NOT NULL DEFAULT E'',
    "type" "notifyType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" INTEGER,
    "channelID" INTEGER,
    "partyID" INTEGER,

    CONSTRAINT "Notify_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "user" INTEGER NOT NULL,
    "content" TEXT NOT NULL DEFAULT E'',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matchs" (
    "id" SERIAL NOT NULL,
    "users" INTEGER,
    "party" INTEGER,

    CONSTRAINT "Matchs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_token_key" ON "User"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_refreshToken_key" ON "User"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_game_key" ON "User"("game");

-- CreateIndex
CREATE UNIQUE INDEX "Party_playerOne_key" ON "Party"("playerOne");

-- CreateIndex
CREATE UNIQUE INDEX "Party_playerTwo_key" ON "Party"("playerTwo");

-- CreateIndex
CREATE UNIQUE INDEX "Party_winner_key" ON "Party"("winner");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_users_key" ON "Channel"("users");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_owner_key" ON "Channel"("owner");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_admins_key" ON "Channel"("admins");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_mutedUsers_key" ON "Channel"("mutedUsers");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_messages_key" ON "Channel"("messages");

-- CreateIndex
CREATE UNIQUE INDEX "Notify_userID_key" ON "Notify"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Notify_channelID_key" ON "Notify"("channelID");

-- CreateIndex
CREATE UNIQUE INDEX "Notify_partyID_key" ON "Notify"("partyID");

-- CreateIndex
CREATE UNIQUE INDEX "Message_user_key" ON "Message"("user");

-- CreateIndex
CREATE UNIQUE INDEX "Matchs_users_key" ON "Matchs"("users");

-- CreateIndex
CREATE UNIQUE INDEX "Matchs_party_key" ON "Matchs"("party");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_game_fkey" FOREIGN KEY ("game") REFERENCES "GameProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_friends_fkey" FOREIGN KEY ("friends") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_blocked_fkey" FOREIGN KEY ("blocked") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_users_fkey" FOREIGN KEY ("users") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_channels_fkey" FOREIGN KEY ("channels") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_notifys_fkey" FOREIGN KEY ("notifys") REFERENCES "Notify"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameProfile" ADD CONSTRAINT "GameProfile_history_fkey" FOREIGN KEY ("history") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_playerOne_fkey" FOREIGN KEY ("playerOne") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_playerTwo_fkey" FOREIGN KEY ("playerTwo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_winner_fkey" FOREIGN KEY ("winner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_users_fkey" FOREIGN KEY ("users") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_admins_fkey" FOREIGN KEY ("admins") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_mutedUsers_fkey" FOREIGN KEY ("mutedUsers") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_messages_fkey" FOREIGN KEY ("messages") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notify" ADD CONSTRAINT "Notify_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notify" ADD CONSTRAINT "Notify_partyID_fkey" FOREIGN KEY ("partyID") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notify" ADD CONSTRAINT "Notify_channelID_fkey" FOREIGN KEY ("channelID") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matchs" ADD CONSTRAINT "Matchs_users_fkey" FOREIGN KEY ("users") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matchs" ADD CONSTRAINT "Matchs_party_fkey" FOREIGN KEY ("party") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;
