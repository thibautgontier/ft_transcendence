import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { Response } from 'express';
import { Party } from '@prisma/client';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get(':id')
  async getGameProfile(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<any> {
    return await this.gameService.getGameProfile(res, Number(id));
  }

  @Get(':id/level')
  async getLevel(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<string | null> {
    return await this.gameService.getLevel(res, Number(id));
  }

  @Get(':id/xp')
  async getXp(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<string | null> {
    return await this.gameService.getXp(res, Number(id));
  }

  @Get(':id/nbParty')
  async getNbParty(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<string | null> {
    return await this.gameService.getNbParty(res, Number(id));
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
    return await this.gameService.getHistory(res, Number(id));
  }
}
