import { Module } from '@nestjs/common';
import { PrismaController } from 'src/prisma/prisma.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MainRoom } from 'src/rooms/main.rooms';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  controllers: [ChannelController, PrismaController],
  providers: [ChannelService, PrismaService, MainRoom],
})
export class ChannelModule {}
