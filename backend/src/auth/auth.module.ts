import { Module } from '@nestjs/common';
import { FtStrategy } from './strategies/ft.strategy';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session.serializer';
import { PrismaController } from 'src/prisma/prisma.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController, PrismaController],
  providers: [AuthService, FtStrategy, SessionSerializer, PrismaService],
})
export class AuthModule {}
