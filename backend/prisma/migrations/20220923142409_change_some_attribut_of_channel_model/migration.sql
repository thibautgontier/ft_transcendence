/*
  Warnings:

  - Made the column `PasswordID` on table `Channel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "PasswordID" SET NOT NULL;
