/*
  Warnings:

  - You are about to drop the column `GameHistoryID` on the `Party` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_GameHistoryID_fkey";

-- AlterTable
ALTER TABLE "Party" DROP COLUMN "GameHistoryID";

-- CreateTable
CREATE TABLE "_history" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_history_AB_unique" ON "_history"("A", "B");

-- CreateIndex
CREATE INDEX "_history_B_index" ON "_history"("B");

-- AddForeignKey
ALTER TABLE "_history" ADD CONSTRAINT "_history_A_fkey" FOREIGN KEY ("A") REFERENCES "GameProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_history" ADD CONSTRAINT "_history_B_fkey" FOREIGN KEY ("B") REFERENCES "Party"("id") ON DELETE CASCADE ON UPDATE CASCADE;
