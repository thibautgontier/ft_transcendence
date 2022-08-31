import { Module } from '@nestjs/common';
import { PrismaController } from 'src/prisma/prisma.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChatRoom } from './chatroom';

@Module({
  controllers: [ChannelController, PrismaController],
  providers: [ChannelService, PrismaService, ChatRoom],
})
export class ChannelModule {}
