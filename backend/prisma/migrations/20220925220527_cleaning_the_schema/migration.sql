/*
  Warnings:

  - You are about to drop the `GameProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_channels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GameProfile" DROP CONSTRAINT "GameProfile_UserID_fkey";

-- DropForeignKey
ALTER TABLE "_channels" DROP CONSTRAINT "_channels_A_fkey";

-- DropForeignKey
ALTER TABLE "_channels" DROP CONSTRAINT "_channels_B_fkey";

-- DropForeignKey
ALTER TABLE "_history" DROP CONSTRAINT "_history_A_fkey";

-- DropForeignKey
ALTER TABLE "_history" DROP CONSTRAINT "_history_B_fkey";

-- DropTable
DROP TABLE "GameProfile";

-- DropTable
DROP TABLE "_channels";

-- DropTable
DROP TABLE "_history";
