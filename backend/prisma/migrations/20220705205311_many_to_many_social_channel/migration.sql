/*
  Warnings:

  - You are about to drop the column `SocialChannelID` on the `Channel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_SocialChannelID_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "SocialChannelID";

-- CreateTable
CREATE TABLE "_channels" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_channels_AB_unique" ON "_channels"("A", "B");

-- CreateIndex
CREATE INDEX "_channels_B_index" ON "_channels"("B");

-- AddForeignKey
ALTER TABLE "_channels" ADD CONSTRAINT "_channels_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channels" ADD CONSTRAINT "_channels_B_fkey" FOREIGN KEY ("B") REFERENCES "SocialProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
