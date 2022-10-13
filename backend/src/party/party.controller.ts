import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Res,
  } from '@nestjs/common';
  import { ApiTags } from '@nestjs/swagger';
  import { Party } from '@prisma/client';
  import { PartyUpdateDto } from './dto/party-update.dto';
  import { PartyService } from './party.service';
  import { Request, Response } from 'express';
  
  @ApiTags('party')
  @Controller('party')
  export class PartyController {
    constructor(private partyService: PartyService) {}
  
    @Get()
    async getParty(@Query('id') id?: number): Promise<Party[]> {
      const partyID = Number(id);
      return await this.partyService.getParty(
        Number.isNaN(partyID) ? undefined : partyID,
      );
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
    
    @Post('gameFinished')
    async gameFinished(@Req() req: Request, @Res() res: Response) {
      if (req.body.winnerId) {
        await this.partyService.finishGame(req.body.winnerId, req.body.loserId);
        res.status(200).send('success');
      }
    }
  }