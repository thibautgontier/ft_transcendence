import { Module } from '@nestjs/common';
import { SessionSerializer } from 'src/auth/session.serializer';
import { FtStrategy } from 'src/auth/strategies/ft.strategy';
import { PrismaController } from 'src/prisma/prisma.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController, PrismaController],
  providers: [UserService, PrismaService, FtStrategy, SessionSerializer],
})
export class UserModule {}
