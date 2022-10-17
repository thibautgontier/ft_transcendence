/*
  Warnings:

  - You are about to drop the column `AccessToken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Token]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[RefreshToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `RefreshToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Token` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_AccessToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "AccessToken",
ADD COLUMN     "RefreshToken" TEXT NOT NULL,
ADD COLUMN     "Token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_Token_key" ON "User"("Token");

-- CreateIndex
CREATE UNIQUE INDEX "User_RefreshToken_key" ON "User"("RefreshToken");
