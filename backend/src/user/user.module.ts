import { Module } from '@nestjs/common';
import { PrismaController } from 'src/prisma/prisma.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController, PrismaController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
