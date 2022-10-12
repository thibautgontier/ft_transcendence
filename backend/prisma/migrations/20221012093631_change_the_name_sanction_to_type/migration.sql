/*
  Warnings:

  - You are about to drop the column `Sanction` on the `BanModel` table. All the data in the column will be lost.
  - Added the required column `Type` to the `BanModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BanModel" DROP COLUMN "Sanction",
ADD COLUMN     "Type" "Sanction" NOT NULL;
