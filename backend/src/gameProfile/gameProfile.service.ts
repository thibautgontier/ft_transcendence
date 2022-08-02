import { HttpStatus, Injectable } from '@nestjs/common';
import { GameProfile, Party } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  toBool(str: string): boolean {
    if (str) {
      str = str.toLowerCase();
      if (['true', '1', 'on', 'yes'].includes(str)) {
        return true;
      } else if (['false', '0', 'off', 'no'].includes(str)) {
        return false;
      }
    }
    return undefined;
  }

  async getGameProfile(
    res: Response,
    userID: number,
  ): Promise<GameProfile | null> {
    try {
      const profile = await this.prisma.gameProfile.findUnique({
        where: { UserID: userID },
      });
      res.status(HttpStatus.OK).send(profile);
      return profile;
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async getLevel(userID: number, res?: Response): Promise<string | null> {
    try {
      const profile = await this.prisma.gameProfile.findUniqueOrThrow({
        where: { UserID: userID },
      });
      res.status(HttpStatus.OK).send(profile.Level.toString());
      return profile.Level.toString();
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async setLevel(
    userID: number,
    level: number,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      await this.prisma.gameProfile.update({
        where: { UserID: userID },
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
    userID: number,
    value: number,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserID: userID },
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
    userID: number,
    value: number,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserID: userID },
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

  async getXp(res: Response, userID: number): Promise<string | null> {
    try {
      const profile = await this.prisma.gameProfile.findUniqueOrThrow({
        where: { UserID: userID },
      });
      res.status(HttpStatus.OK).send(profile.Xp.toString());
      return profile.Xp.toString();
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async setXp(
    userID: number,
    xp: number,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      await this.prisma.gameProfile.update({
        where: { UserID: userID },
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
    userID: number,
    value: number,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserID: userID },
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
    userID: number,
    value: number,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserID: userID },
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

  async getNbParty(res: Response, userID: number): Promise<string | null> {
    try {
      const profile = await this.prisma.gameProfile.findUniqueOrThrow({
        where: { UserID: userID },
      });
      res.status(HttpStatus.OK).send(profile.NbParty.toString());
      return profile.NbParty.toString();
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async setNbParty(
    userID: number,
    nbParty: number,
    win: string,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      await this.prisma.gameProfile.update({
        where: { UserID: userID },
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
    userID: number,
    value: number,
    win: string,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserID: userID },
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
    userID: number,
    value: number,
    win: string,
    res?: Response,
  ): Promise<number | undefined> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserID: userID },
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

  async getNbWin(res: Response, userID: number): Promise<string | null> {
    try {
      const profile = await this.prisma.gameProfile.findUniqueOrThrow({
        where: { UserID: userID },
      });
      res.status(HttpStatus.OK).send(profile.NbWin.toString());
      return profile.NbWin.toString();
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async getNbLose(res: Response, userID: number): Promise<string | null> {
    try {
      const profile = await this.prisma.gameProfile.findUniqueOrThrow({
        where: { UserID: userID },
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

  async getHistory(
    userID: number,
    partyID: number,
    res?: Response,
  ): Promise<Party[] | null> {
    try {
      const profile = await this.prisma.gameProfile.findUniqueOrThrow({
        where: { UserID: userID },
        include: { History: { where: { id: partyID } } },
      });
      res.status(HttpStatus.OK).send(profile.History);
      return profile.History;
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send(error);
      return null;
    }
  }

  async addToHistory(
    userID: number,
    partyID: number,
    res?: Response,
  ): Promise<Party[] | null> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserID: userID },
        data: { History: { connect: { id: partyID } } },
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
    userID: number,
    partyID: number,
    res?: Response,
  ): Promise<Party[] | null> {
    try {
      const profile = await this.prisma.gameProfile.update({
        where: { UserID: userID },
        data: { History: { disconnect: { id: partyID } } },
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
