/*
  Warnings:

  - You are about to drop the column `ChannelOwnerID` on the `Channel` table. All the data in the column will be lost.
  - Added the required column `OwnerID` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_ChannelOwnerID_fkey";

-- DropIndex
DROP INDEX "Channel_ChannelOwnerID_key";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "ChannelOwnerID",
ADD COLUMN     "OwnerID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_OwnerID_fkey" FOREIGN KEY ("OwnerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
