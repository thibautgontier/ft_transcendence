/*
  Warnings:

  - Made the column `Name` on table `Channel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "Name" SET NOT NULL;
