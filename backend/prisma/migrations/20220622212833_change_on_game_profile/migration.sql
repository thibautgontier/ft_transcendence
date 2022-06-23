/*
  Warnings:

  - You are about to drop the column `game` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameProfile]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameProfile` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_game_fkey";

-- DropIndex
DROP INDEX "User_game_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "game",
ADD COLUMN     "gameProfile" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_gameProfile_key" ON "User"("gameProfile");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gameProfile_fkey" FOREIGN KEY ("gameProfile") REFERENCES "GameProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
