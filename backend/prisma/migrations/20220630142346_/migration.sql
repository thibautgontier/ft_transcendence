-- DropForeignKey
ALTER TABLE "GameProfile" DROP CONSTRAINT "GameProfile_UserId_fkey";

-- DropForeignKey
ALTER TABLE "SocialProfile" DROP CONSTRAINT "SocialProfile_UserId_fkey";

-- AlterTable
ALTER TABLE "GameProfile" ALTER COLUMN "UserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SocialProfile" ALTER COLUMN "UserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GameProfile" ADD CONSTRAINT "GameProfile_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialProfile" ADD CONSTRAINT "SocialProfile_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
