import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

@Module({
  controllers: [SocialController],
  providers: [SocialService, PrismaService, AuthService, JwtService],
})
export class SocialModule {}
