import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { SessionSerializer } from 'src/auth/session.serializer';
import { FtStrategy } from 'src/auth/strategies/ft.strategy';
import { PrismaController } from 'src/prisma/prisma.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AuthModule],
  controllers: [UserController, PrismaController],
  providers: [
    UserService,
    PrismaService,
    FtStrategy,
    SessionSerializer,
    AuthService,
    JwtService,
  ],
})
export class UserModule {}
