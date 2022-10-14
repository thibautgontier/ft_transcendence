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
  import { AuthService } from 'src/auth/auth.service';
  import { Request, Response } from 'express';
  
  @ApiTags('party')
  @Controller('party')
  export class PartyController {
    constructor(private partyService: PartyService, private authService: AuthService) {}
  
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

    @Post('gameFinished') //body {winnerId: number, loserId: number}
    async gameFinished(@Req() req: Request, @Res() res: Response) {
      if (req.headers.authorization) {
        const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
        if (user) {
          if (req.body.winnerId) {
            await this.partyService.finishGame(req.body.winnerId, req.body.loserId);
            res.status(200).send('success');
          }
        }
      }
    }
  }