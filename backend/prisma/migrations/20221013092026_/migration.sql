-- CreateEnum
CREATE TYPE "logStatus" AS ENUM ('online', 'offline', 'doNotDistrub', 'AFK', 'invisible', 'inGame');

-- CreateEnum
CREATE TYPE "Sanction" AS ENUM ('ban', 'mute');

-- CreateEnum
CREATE TYPE "partyStatus" AS ENUM ('starting', 'running', 'finish');

-- CreateEnum
CREATE TYPE "channelType" AS ENUM ('private', 'protected', 'public');

-- CreateEnum
CREATE TYPE "notifyType" AS ENUM ('newMessage', 'playRequest', 'friendRequest');

-- CreateTable
CREATE TABLE "User" (
    "Avatar" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Email" TEXT,
    "Nickname" TEXT,
    "Status" "logStatus" NOT NULL DEFAULT 'offline',
    "TwoFA" BOOLEAN NOT NULL DEFAULT false,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "Connected" BOOLEAN NOT NULL DEFAULT false,
    "TwoFaCode" INTEGER,
    "IntraName" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameProfile" (
    "id" SERIAL NOT NULL,
    "Level" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "Xp" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "NbParty" INTEGER NOT NULL DEFAULT 0,
    "NbWin" INTEGER NOT NULL DEFAULT 0,
    "UserID" INTEGER,

    CONSTRAINT "GameProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Status" "partyStatus" NOT NULL DEFAULT 'starting',
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "PlayerOneID" INTEGER,
    "PlayerTwoID" INTEGER,
    "WinnerID" INTEGER,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialProfile" (
    "id" SERIAL NOT NULL,
    "UserID" INTEGER,

    CONSTRAINT "SocialProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Description" TEXT,
    "Name" TEXT NOT NULL,
    "Type" "channelType" NOT NULL DEFAULT 'public',
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "OwnerID" INTEGER NOT NULL,
    "RoomId" TEXT NOT NULL,
    "PasswordID" INTEGER NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BanModel" (
    "id" SERIAL NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Reason" TEXT NOT NULL,
    "UserID" INTEGER NOT NULL,
    "ChannelID" INTEGER NOT NULL,
    "Type" "Sanction" NOT NULL,
    "Duration" INTEGER NOT NULL,

    CONSTRAINT "BanModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelPassword" (
    "id" SERIAL NOT NULL,
    "Password" TEXT,

    CONSTRAINT "ChannelPassword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "Content" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "ChannelID" INTEGER NOT NULL,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_history" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_blocked" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_friends" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_admin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_banUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_chanUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_mutedUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "User_Nickname_key" ON "User"("Nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_IntraName_key" ON "User"("IntraName");

-- CreateIndex
CREATE UNIQUE INDEX "GameProfile_UserID_key" ON "GameProfile"("UserID");

-- CreateIndex
CREATE UNIQUE INDEX "SocialProfile_UserID_key" ON "SocialProfile"("UserID");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_Name_key" ON "Channel"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_PasswordID_key" ON "Channel"("PasswordID");

-- CreateIndex
CREATE UNIQUE INDEX "_history_AB_unique" ON "_history"("A", "B");

-- CreateIndex
CREATE INDEX "_history_B_index" ON "_history"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_blocked_AB_unique" ON "_blocked"("A", "B");

-- CreateIndex
CREATE INDEX "_blocked_B_index" ON "_blocked"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_friends_AB_unique" ON "_friends"("A", "B");

-- CreateIndex
CREATE INDEX "_friends_B_index" ON "_friends"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_admin_AB_unique" ON "_admin"("A", "B");

-- CreateIndex
CREATE INDEX "_admin_B_index" ON "_admin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_banUser_AB_unique" ON "_banUser"("A", "B");

-- CreateIndex
CREATE INDEX "_banUser_B_index" ON "_banUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_chanUsers_AB_unique" ON "_chanUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_chanUsers_B_index" ON "_chanUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_mutedUser_AB_unique" ON "_mutedUser"("A", "B");

-- CreateIndex
CREATE INDEX "_mutedUser_B_index" ON "_mutedUser"("B");

-- AddForeignKey
ALTER TABLE "GameProfile" ADD CONSTRAINT "GameProfile_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_PlayerOneID_fkey" FOREIGN KEY ("PlayerOneID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_PlayerTwoID_fkey" FOREIGN KEY ("PlayerTwoID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_WinnerID_fkey" FOREIGN KEY ("WinnerID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialProfile" ADD CONSTRAINT "SocialProfile_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_OwnerID_fkey" FOREIGN KEY ("OwnerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_PasswordID_fkey" FOREIGN KEY ("PasswordID") REFERENCES "ChannelPassword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanModel" ADD CONSTRAINT "BanModel_ChannelID_fkey" FOREIGN KEY ("ChannelID") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanModel" ADD CONSTRAINT "BanModel_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_ChannelID_fkey" FOREIGN KEY ("ChannelID") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_history" ADD CONSTRAINT "_history_A_fkey" FOREIGN KEY ("A") REFERENCES "GameProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_history" ADD CONSTRAINT "_history_B_fkey" FOREIGN KEY ("B") REFERENCES "Party"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_A_fkey" FOREIGN KEY ("A") REFERENCES "SocialProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_A_fkey" FOREIGN KEY ("A") REFERENCES "SocialProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_admin" ADD CONSTRAINT "_admin_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_admin" ADD CONSTRAINT "_admin_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_banUser" ADD CONSTRAINT "_banUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_banUser" ADD CONSTRAINT "_banUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chanUsers" ADD CONSTRAINT "_chanUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chanUsers" ADD CONSTRAINT "_chanUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mutedUser" ADD CONSTRAINT "_mutedUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mutedUser" ADD CONSTRAINT "_mutedUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
