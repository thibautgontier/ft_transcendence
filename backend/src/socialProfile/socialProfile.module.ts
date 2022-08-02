import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocialController } from './socialProfile.controller';
import { SocialService } from './socialProfile.service';

@Module({
  controllers: [SocialController],
  providers: [SocialService, PrismaService],
})
export class SocialModule {}
