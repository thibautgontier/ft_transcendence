/*
  Warnings:

  - You are about to drop the column `ExpiresAt` on the `BanModel` table. All the data in the column will be lost.
  - Added the required column `Duration` to the `BanModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BanModel" DROP COLUMN "ExpiresAt",
ADD COLUMN     "Duration" INTEGER NOT NULL;
