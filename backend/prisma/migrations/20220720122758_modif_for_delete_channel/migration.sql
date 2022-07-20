-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_ChannelID_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_ChannelID_fkey" FOREIGN KEY ("ChannelID") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
