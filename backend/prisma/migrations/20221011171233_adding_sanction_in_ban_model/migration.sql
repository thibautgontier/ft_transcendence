/*
  Warnings:

  - Added the required column `Sanction` to the `BanModel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Sanction" AS ENUM ('ban', 'mute');

-- AlterTable
ALTER TABLE "BanModel" ADD COLUMN     "Sanction" "Sanction" NOT NULL;
