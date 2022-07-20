import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Party } from '@prisma/client';
import { PartyUpdateDto } from './dto/party-update.dto';
import { PartyService } from './party.service';
import { Response } from 'express';

@ApiTags('party')
@Controller('party')
export class PartyController {
  constructor(private partyService: PartyService) {}

  @Get()
  async getParty(@Query('id') id?: number): Promise<Party[]> {
    return await this.partyService.getParty(Number(id));
  }

  @Post('create')
  async createParty(): Promise<Party> {
    return await this.partyService.createParty();
  }

  @Patch('update/:id')
  async updateParty(
    @Body() body: PartyUpdateDto,
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Party | null> {
    return await this.partyService.updateParty(body, Number(id), res);
  }

  @Delete('delete/:id')
  async deleteParty(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Party | null> {
    return await this.partyService.deleteParty(Number(id), res);
  }
}
