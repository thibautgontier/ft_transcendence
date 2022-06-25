/*
  Warnings:

  - You are about to drop the column `users` on the `Social` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Social" DROP CONSTRAINT "Social_users_fkey";

-- AlterTable
ALTER TABLE "Social" DROP COLUMN "users";
