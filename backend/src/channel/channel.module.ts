import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client } from 'colyseus.js';
import { AuthService } from 'src/auth/auth.service';
import { PrismaController } from 'src/prisma/prisma.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChatRoom } from './chat.rooms';

@Module({
  controllers: [ChannelController, PrismaController],
  providers: [ChannelService, PrismaService, ChatRoom, Client, AuthService, JwtService],
})
export class ChannelModule {}
