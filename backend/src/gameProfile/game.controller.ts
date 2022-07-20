import { Controller, Get, Param, Patch, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { Response } from 'express';
import { GameProfile, Party } from '@prisma/client';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get(':userID')
  async getGameProfile(
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<GameProfile> {
    return await this.gameService.getGameProfile(res, Number(userID));
  }

  @Get(':userID/level')
  async getLevel(
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<string | null> {
    return await this.gameService.getLevel(Number(userID), res);
  }

  @Patch(':userID/level/set/:level')
  async setLevel(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('level') level: number,
  ): Promise<number | undefined> {
    return await this.gameService.setLevel(Number(userID), Number(level), res);
  }

  @Patch(':userID/level/add/:value')
  async addLevel(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('value') value: number,
  ): Promise<number | undefined> {
    return await this.gameService.addLevel(Number(userID), Number(value), res);
  }

  @Patch(':userID/level/remove/:value')
  async removeLevel(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('value') value: number,
  ): Promise<number | undefined> {
    return await this.gameService.removeLevel(
      Number(userID),
      Number(value),
      res,
    );
  }

  @Get(':userID/xp')
  async getXp(
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<string | null> {
    return await this.gameService.getXp(res, Number(userID));
  }

  @Patch(':userID/xp/set/:xp')
  async setXp(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('xp') xp: number,
  ): Promise<number | undefined> {
    return await this.gameService.setXp(Number(userID), Number(xp), res);
  }

  @Patch(':userID/xp/add/:value')
  async addXp(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('value') value: number,
  ): Promise<number | undefined> {
    return await this.gameService.addXp(Number(userID), Number(value), res);
  }

  @Patch(':userID/xp/remove/:value')
  async removeXp(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('value') value: number,
  ): Promise<number | undefined> {
    return await this.gameService.removeXp(Number(userID), Number(value), res);
  }

  @Get(':userID/nbParty')
  async getNbParty(
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<string | null> {
    return await this.gameService.getNbParty(res, Number(userID));
  }

  @Patch(':userID/nbParty/set/:nbParty')
  async setNbParty(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('nbParty') nbParty: number,
    @Query('win') win: string,
  ): Promise<number | undefined> {
    return await this.gameService.setNbParty(
      Number(userID),
      Number(nbParty),
      win,
      res,
    );
  }

  @Patch(':userID/nbParty/add/:value')
  async addNbParty(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('value') value: number,
    @Query('win') win: string,
  ): Promise<number | undefined> {
    return await this.gameService.addNbParty(
      Number(userID),
      Number(value),
      win,
      res,
    );
  }

  @Patch(':userID/nbParty/remove/:value')
  async removeNbParty(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('value') value: number,
    @Query('win') win: string,
  ): Promise<number | undefined> {
    return await this.gameService.removeNbParty(
      Number(userID),
      Number(value),
      win,
      res,
    );
  }

  @Get(':userID/nbWin')
  async getNbWin(
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<string | null> {
    return await this.gameService.getNbWin(res, Number(userID));
  }

  @Get(':userID/nbLose')
  async getNbLose(
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<string | null> {
    return await this.gameService.getNbLose(res, Number(userID));
  }

  @Get(':userID/history')
  async getHistory(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Query('party') partyID?: number,
  ): Promise<Party[] | null> {
    const id = Number(partyID);
    return await this.gameService.getHistory(
      Number(userID),
      Number.isNaN(id) ? undefined : id,
      res,
    );
  }

  @Patch(':userID/history/add/:partyID')
  async addToHistory(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('partyID') partyID: number,
  ): Promise<Party[] | null> {
    return await this.gameService.addToHistory(
      Number(userID),
      Number(partyID),
      res,
    );
  }

  @Patch(':userID/history/remove/:partyID')
  async removeFromHistory(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('partyID') partyID: number,
  ): Promise<Party[] | null> {
    return await this.gameService.removeFromHistory(
      Number(userID),
      Number(partyID),
      res,
    );
  }
}
