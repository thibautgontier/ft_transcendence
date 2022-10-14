import { Controller, Get, Param, Patch, Query, Res, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { Response, Request } from 'express';
import { GameProfile, Party } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private gameService: GameService, private authService: AuthService) {}

  @Get(':userID')
  async getGameProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<GameProfile> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.gameService.getGameProfile(res, Number(userID));
    }
  }

  @Get(':userID/level')
  async getLevel(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<string | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.gameService.getLevel(Number(userID), res);
    }
  }

  @Patch(':userID/level/set/:level')
  async setLevel(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('level') level: number,
  ): Promise<number | undefined> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.gameService.setLevel(Number(userID), Number(level), res);
    }
  }

  @Patch(':userID/level/add/:value')
  async addLevel(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('value') value: number,
  ): Promise<number | undefined> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.gameService.addLevel(Number(userID), Number(value), res);
    }
  }

  @Patch(':userID/level/remove/:value')
  async removeLevel(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('value') value: number,
  ): Promise<number | undefined> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.gameService.removeLevel(
          Number(userID),
          Number(value),
          res,
        );
      }
    }
  }

  @Get(':userID/xp')
  async getXp(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<string | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.gameService.getXp(res, Number(userID));
    }
  }

  @Patch(':userID/xp/set/:xp')
  async setXp(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('xp') xp: number,
  ): Promise<number | undefined> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.gameService.setXp(Number(userID), Number(xp), res);
    }
  }

  @Patch(':userID/xp/add/:value')
  async addXp(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('value') value: number,
  ): Promise<number | undefined> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.gameService.addXp(Number(userID), Number(value), res);
    }
  }

  @Patch(':userID/xp/remove/:value')
  async removeXp(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('value') value: number,
  ): Promise<number | undefined> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.gameService.removeXp(Number(userID), Number(value), res);
    }
  }

  @Get(':userID/nbParty')
  async getNbParty(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<string | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.gameService.getNbParty(res, Number(userID));
    }
  }

  @Patch(':userID/nbParty/set/:nbParty')
  async setNbParty(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('nbParty') nbParty: number,
    @Query('win') win: string,
  ): Promise<number | undefined> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.gameService.setNbParty(
          Number(userID),
          Number(nbParty),
          win,
          res,
        );
      }
    }
  }

  @Patch(':userID/nbParty/add/:value')
  async addNbParty(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('value') value: number,
    @Query('win') win: string,
  ): Promise<number | undefined> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.gameService.addNbParty(
          Number(userID),
          Number(value),
          win,
          res,
        );
      }
    }
  }

  @Patch(':userID/nbParty/remove/:value')
  async removeNbParty(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('value') value: number,
    @Query('win') win: string,
  ): Promise<number | undefined> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.gameService.removeNbParty(
          Number(userID),
          Number(value),
          win,
          res,
        );
      }
    }
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
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<string | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.gameService.getNbLose(res, Number(userID));
    }
  }

  @Get(':userID/history')
  async getHistory(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<Party[] | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.gameService.getHistory(Number(userID), res);
    }
  }

  @Get(':userID/history/:partyID')
  async getHistoryParty(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('partyID') partyID: number,
  ): Promise<Party | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.gameService.getHistoryParty(
          res,
          Number(userID),
          Number(partyID),
        );
      }
    }
  }

  @Patch(':userID/history/add/:partyID')
  async addToHistory(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('partyID') partyID: number,
  ): Promise<Party[] | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.gameService.addToHistory(
          Number(userID),
          Number(partyID),
          res,
        );
      }
    }
  }

  @Patch(':userID/history/remove/:partyID')
  async removeFromHistory(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('partyID') partyID: number,
  ): Promise<Party[] | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.gameService.removeFromHistory(
          Number(userID),
          Number(partyID),
          res,
        );
      }
    }
  }
}
