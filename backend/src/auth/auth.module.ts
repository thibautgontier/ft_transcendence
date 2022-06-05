import { Module } from '@nestjs/common';
import { FtStrategy } from './ft.strategy';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session.serializer';

@Module({
  controllers: [AuthController],
  providers: [FtStrategy, SessionSerializer],
})
export class AuthModule {}
