import { Controller, Get, Param, Patch, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { Response } from 'express';
import { GameProfile, Party } from '@prisma/client';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get(':id')
  async getGameProfile(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<GameProfile> {
    return await this.gameService.getGameProfile(res, Number(id));
  }

  @Get(':id/level')
  async getLevel(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<string | null> {
    return await this.gameService.getLevel(Number(id), res);
  }

  @Patch(':id/level/set/:level')
  async setLevel(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('level') level: number,
  ): Promise<number | undefined> {
    return await this.gameService.setLevel(Number(id), Number(level), res);
  }

  @Patch(':id/level/add/:value')
  async addLevel(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('value') value: number,
  ): Promise<number | undefined> {
    return await this.gameService.addLevel(Number(id), Number(value), res);
  }

  @Patch(':id/level/remove/:value')
  async removeLevel(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('value') value: number,
  ): Promise<number | undefined> {
    return await this.gameService.removeLevel(Number(id), Number(value), res);
  }

  @Get(':id/xp')
  async getXp(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<string | null> {
    return await this.gameService.getXp(res, Number(id));
  }

  @Patch(':id/xp/set/:xp')
  async setXp(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('xp') xp: number,
  ): Promise<number | undefined> {
    return await this.gameService.setXp(Number(id), Number(xp), res);
  }

  @Patch(':id/xp/add/:value')
  async addXp(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('value') value: number,
  ): Promise<number | undefined> {
    return await this.gameService.addXp(Number(id), Number(value), res);
  }

  @Patch(':id/xp/remove/:value')
  async removeXp(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('value') value: number,
  ): Promise<number | undefined> {
    return await this.gameService.removeXp(Number(id), Number(value), res);
  }

  @Get(':id/nbParty')
  async getNbParty(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<string | null> {
    return await this.gameService.getNbParty(res, Number(id));
  }

  @Patch(':id/nbParty/set/:nbParty')
  async setNbParty(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('nbParty') nbParty: number,
    @Query('win') win: string,
  ): Promise<number | undefined> {
    return await this.gameService.setNbParty(
      Number(id),
      Number(nbParty),
      win,
      res,
    );
  }

  @Patch(':id/nbParty/add/:value')
  async addNbParty(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('value') value: number,
    @Query('win') win: string,
  ): Promise<number | undefined> {
    return await this.gameService.addNbParty(
      Number(id),
      Number(value),
      win,
      res,
    );
  }

  @Patch(':id/nbParty/remove/:value')
  async removeNbParty(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('value') value: number,
    @Query('win') win: string,
  ): Promise<number | undefined> {
    return await this.gameService.removeNbParty(
      Number(id),
      Number(value),
      win,
      res,
    );
  }

  @Get(':id/nbWin')
  async getNbWin(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<string | null> {
    return await this.gameService.getNbWin(res, Number(id));
  }

  @Get(':id/nbLose')
  async getNbLose(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<string | null> {
    return await this.gameService.getNbLose(res, Number(id));
  }

  @Get(':id/history')
  async getHistory(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<Party[] | null> {
    return await this.gameService.getHistory(Number(id), res);
  }

  @Get(':id/history/:partyId')
  async getHistoryParty(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('partyId') partyId: number,
  ): Promise<Party | null> {
    return await this.gameService.getHistoryParty(
      res,
      Number(id),
      Number(partyId),
    );
  }

  @Patch(':id/history/add/:partyId')
  async addToHistory(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('partyId') partyId: number,
  ): Promise<Party[] | null> {
    return await this.gameService.addToHistory(
      Number(id),
      Number(partyId),
      res,
    );
  }

  @Patch(':id/history/remove/:partyId')
  async removeFromHistory(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('partyId') partyId: number,
  ): Promise<Party[] | null> {
    return await this.gameService.removeFromHistory(
      Number(id),
      Number(partyId),
      res,
    );
  }
}
