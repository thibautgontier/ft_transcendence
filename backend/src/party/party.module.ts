import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';

@Module({
  controllers: [PartyController],
  providers: [PartyService, PrismaService, AuthService, JwtService],
})
export class PartyModule {}