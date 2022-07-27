/*
  Warnings:

  - You are about to drop the column `UserMessageID` on the `User` table. All the data in the column will be lost.
  - Added the required column `UserID` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_UserMessageID_fkey";

-- DropIndex
DROP INDEX "User_UserMessageID_key";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "UserID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "UserMessageID";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
