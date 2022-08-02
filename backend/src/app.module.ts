import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.shema';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { PrismaController } from './prisma/prisma.controller';
import { ChannelModule } from './channel/channel.module';
import { SocialModule } from './socialProfile/socialProfile.module';
import { GameModule } from './gameProfile/gameProfile.module';
import { PartyModule } from './party/party.module';
import { GameService } from './game.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
    }),
    AuthModule,
    UserModule,
    ChannelModule,
    SocialModule,
    GameModule,
    PartyModule,
  ],
  providers: [PrismaService, GameService],
  controllers: [PrismaController],
})
export class AppModule {}
