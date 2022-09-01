import { Module } from '@nestjs/common';
import { Client } from 'colyseus.js';
import { PrismaController } from 'src/prisma/prisma.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChatRoom } from './chat.rooms';

@Module({
  controllers: [ChannelController, PrismaController],
  providers: [ChannelService, PrismaService, ChatRoom, Client],
})
export class ChannelModule {}
