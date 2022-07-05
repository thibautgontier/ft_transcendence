import { Module } from '@nestjs/common';
import { PrismaController } from 'src/prisma/prisma.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  controllers: [ChannelController, PrismaController],
  providers: [ChannelService, PrismaService],
})
export class ChannelModule {}
