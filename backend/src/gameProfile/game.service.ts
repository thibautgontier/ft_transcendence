import { HttpStatus, Injectable } from '@nestjs/common';
import { GameProfile, Party } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  toBool(str: string): boolean {
    if (str === null || str === undefined) return undefined;
    str = str.toLowerCase();
    if (['true', '1', 'on', 'yes'].includes(str)) {
      return true;
    } else if (['false', '0', 'off', 'no'].includes(str)) {
      return false;
    }
    return undefined;
  }

  async getGameProfile(res: Response, id: number): Promise<GameProfile | null> {
    try {
      const profile = await this.prisma.gameProfile.findUnique({
        where: { UserId: id },
      });
      res.status(HttpStatus.OK).send(profile);
      return profile;
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async getLevel(id: number, res?: Response): Promise<string | null> {
    try {
      const profile = await this.prisma.gameProfile.findUniqueOrThrow({
        where: { UserId: id },
      });
      res.status(HttpStatus.OK).send(profile.Level.toString());
      return profile.Level.toString();
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async setLevel(
    id: number,
    level: number,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      await this.prisma.gameProfile.update({
        where: { UserId: id },
        data: { Level: level },
      });
      if (res !== undefined) {
        res.status(HttpStatus.OK).send(level.toString());
      }
      return level;
    } catch (error) {
      if (res !== undefined) {
        res.status(HttpStatus.NOT_FOUND).send(error);
      }
      return undefined;
    }
  }

  async addLevel(
    id: number,
    value: number,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserId: id },
        data: { Level: { increment: value } },
      });
      if (res !== undefined) {
        res.status(HttpStatus.OK).send(profile.Level.toString());
      }
      return profile.Level;
    } catch (error) {
      if (res !== undefined) {
        res.status(HttpStatus.NOT_FOUND).send(error);
      }
      return undefined;
    }
  }

  async removeLevel(
    id: number,
    value: number,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserId: id },
        data: { Level: { decrement: value } },
      });
      if (res !== undefined) {
        res.status(HttpStatus.OK).send(profile.Level.toString());
      }
      return profile.Level;
    } catch (error) {
      if (res !== undefined) {
        res.status(HttpStatus.NOT_FOUND).send(error);
      }
      return undefined;
    }
  }

  async getXp(res: Response, id: number): Promise<string | null> {
    try {
      const profile = await this.prisma.gameProfile.findUniqueOrThrow({
        where: { UserId: id },
      });
      res.status(HttpStatus.OK).send(profile.Xp.toString());
      return profile.Xp.toString();
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async setXp(
    id: number,
    xp: number,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      await this.prisma.gameProfile.update({
        where: { UserId: id },
        data: { Xp: xp },
      });
      if (res !== undefined) {
        res.status(HttpStatus.OK).send(xp.toString());
      }
      return xp;
    } catch (error) {
      if (res !== undefined) {
        res.status(HttpStatus.NOT_FOUND).send(error);
      }
      return undefined;
    }
  }

  async addXp(
    id: number,
    value: number,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserId: id },
        data: { Xp: { increment: value } },
      });
      if (res !== undefined) {
        res.status(HttpStatus.OK).send(profile.Xp.toString());
      }
      return profile.Xp;
    } catch (error) {
      if (res !== undefined) {
        res.status(HttpStatus.NOT_FOUND).send(error);
      }
      return undefined;
    }
  }

  async removeXp(
    id: number,
    value: number,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserId: id },
        data: { Xp: { decrement: value } },
      });
      if (res !== undefined) {
        res.status(HttpStatus.OK).send(profile.Xp.toString());
      }
      return profile.Xp;
    } catch (error) {
      if (res !== undefined) {
        res.status(HttpStatus.NOT_FOUND).send(error);
      }
      return undefined;
    }
  }

  async getNbParty(res: Response, id: number): Promise<string | null> {
    try {
      const profile = await this.prisma.gameProfile.findUniqueOrThrow({
        where: { UserId: id },
      });
      res.status(HttpStatus.OK).send(profile.NbParty.toString());
      return profile.NbParty.toString();
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async setNbParty(
    id: number,
    nbParty: number,
    win: string,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      await this.prisma.gameProfile.update({
        where: { UserId: id },
        data: {
          NbParty: nbParty,
          NbWin: this.toBool(win) === true ? nbParty : undefined,
        },
      });
      if (res !== undefined) {
        res.status(HttpStatus.OK).send(nbParty.toString());
      }
      return nbParty;
    } catch (error) {
      if (res !== undefined) {
        res.status(HttpStatus.NOT_FOUND).send(error);
      }
      return undefined;
    }
  }

  async addNbParty(
    id: number,
    value: number,
    win: string,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserId: id },
        data: {
          NbParty: { increment: value },
          NbWin: this.toBool(win) === true ? value : 0,
        },
      });
      if (res !== undefined) {
        res.status(HttpStatus.OK).send(profile.NbParty.toString());
      }
      return profile.NbParty;
    } catch (error) {
      if (res !== undefined) {
        res.status(HttpStatus.NOT_FOUND).send(error);
      }
      return undefined;
    }
  }

  async removeNbParty(
    id: number,
    value: number,
    win: string,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserId: id },
        data: {
          NbParty: { decrement: value },
          NbWin: { decrement: this.toBool(win) === true ? value : 0 },
        },
      });
      if (res !== undefined) {
        res.status(HttpStatus.OK).send(profile.NbParty.toString());
      }
      return profile.NbParty;
    } catch (error) {
      if (res !== undefined) {
        res.status(HttpStatus.NOT_FOUND).send(error);
      }
      return undefined;
    }
  }

  async getNbWin(res: Response, id: number): Promise<string | null> {
    try {
      const profile = await this.prisma.gameProfile.findUniqueOrThrow({
        where: { UserId: id },
      });
      res.status(HttpStatus.OK).send(profile.NbWin.toString());
      return profile.NbWin.toString();
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async getNbLose(res: Response, id: number): Promise<string | null> {
    try {
      const profile = await this.prisma.gameProfile.findUniqueOrThrow({
        where: { UserId: id },
      });
      res
        .status(HttpStatus.OK)
        .send((profile.NbParty - profile.NbWin).toString());
      return (profile.NbParty - profile.NbWin).toString();
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async getHistory(id: number, res?: Response): Promise<Party[] | null> {
    try {
      const profile = await this.prisma.gameProfile.findUniqueOrThrow({
        where: { UserId: id },
        include: { History: true },
      });
      res.status(HttpStatus.OK).send(profile.History);
      return profile.History;
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async getHistoryParty(
    res: Response,
    id: number,
    idParty,
  ): Promise<Party | null> {
    try {
      const history = await this.getHistory(id);
      const party = history.find((p) => p.id === idParty);
      if (party === undefined) {
        res.status(HttpStatus.NOT_FOUND).send('Party not found');
        return null;
      }
      res.status(HttpStatus.OK).send(party);
      return party;
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async addToHistory(
    id: number,
    idParty: number,
    res?: Response,
  ): Promise<Party[] | null> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserId: id },
        data: { History: { connect: { id: idParty } } },
        include: { History: true },
      });
      if (res !== undefined) {
        res.status(HttpStatus.OK).send(profile.History);
      }
      return profile.History;
    } catch (error) {
      if (res !== undefined) {
        res.status(HttpStatus.NOT_FOUND).send(error);
      }
      return null;
    }
  }

  async removeFromHistory(
    id: number,
    idParty: number,
    res?: Response,
  ): Promise<Party[] | null> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserId: id },
        data: { History: { disconnect: { id: idParty } } },
        include: { History: true },
      });
      if (res !== undefined) {
        res.status(HttpStatus.OK).send(profile.History);
      }
      return profile.History;
    } catch (error) {
      if (res !== undefined) {
        res.status(HttpStatus.NOT_FOUND).send(error);
      }
      return null;
    }
  }
}
