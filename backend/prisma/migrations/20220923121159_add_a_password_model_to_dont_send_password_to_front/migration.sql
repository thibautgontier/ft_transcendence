/*
  Warnings:

  - You are about to drop the column `Password` on the `Channel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[PasswordID]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "Password",
ADD COLUMN     "PasswordID" INTEGER;

-- CreateTable
CREATE TABLE "ChannelPassword" (
    "id" SERIAL NOT NULL,
    "Password" TEXT,

    CONSTRAINT "ChannelPassword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_PasswordID_key" ON "Channel"("PasswordID");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_PasswordID_fkey" FOREIGN KEY ("PasswordID") REFERENCES "ChannelPassword"("id") ON DELETE CASCADE ON UPDATE CASCADE;
