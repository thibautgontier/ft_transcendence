/*
  Warnings:

  - A unique constraint covering the columns `[social]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `social` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `gameProfile` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "social" INTEGER NOT NULL,
ALTER COLUMN "gameProfile" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_social_key" ON "User"("social");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_social_fkey" FOREIGN KEY ("social") REFERENCES "Social"("id") ON DELETE CASCADE ON UPDATE CASCADE;
