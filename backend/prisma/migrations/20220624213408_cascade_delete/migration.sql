-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_gameProfile_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatar" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gameProfile_fkey" FOREIGN KEY ("gameProfile") REFERENCES "GameProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
