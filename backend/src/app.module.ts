import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.shema';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { PrismaController } from './prisma/prisma.controller';
import { ChannelModule } from './channel/channel.module';
import { SocialModule } from './socialProfile/social.module';
import { GameModule } from './gameProfile/game.module';
import { PartyModule } from './party/party.module';

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
  providers: [PrismaService],
  controllers: [PrismaController],
})
export class AppModule {}
