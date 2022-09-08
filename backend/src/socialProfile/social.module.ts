import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

@Module({
  controllers: [SocialController],
  providers: [SocialService, PrismaService],
})
export class SocialModule {}
