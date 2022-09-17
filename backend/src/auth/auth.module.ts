import { Module } from '@nestjs/common';
import { FtStrategy } from './strategies/ft.strategy';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session.serializer';
import { PrismaController } from 'src/prisma/prisma.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController, PrismaController],
  providers: [
    AuthService,
    FtStrategy,
    SessionSerializer,
    PrismaService,
    JwtStrategy,
  ],
})
export class AuthModule {}
