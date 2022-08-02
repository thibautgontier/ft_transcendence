import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameController } from './gameProfile.controller';
import { GameService } from './gameProfile.service';

@Module({
  controllers: [GameController],
  providers: [GameService, PrismaService],
})
export class GameModule {}
