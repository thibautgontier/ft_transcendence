import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';

@Module({
  controllers: [PartyController],
  providers: [PartyService, PrismaService],
})
export class PartyModule {}