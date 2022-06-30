import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.shema';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { PrismaController } from './prisma/prisma.controller';
import { ChannelModule } from './channel/channel.module';
import { SocialModule } from './social/social.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
    }),
    AuthModule,
    UserModule,
    ChannelModule,
    SocialModule,
  ],
  providers: [PrismaService],
  controllers: [PrismaController],
})
export class AppModule {}
