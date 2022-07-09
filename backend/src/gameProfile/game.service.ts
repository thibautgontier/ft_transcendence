import { HttpStatus, Injectable } from '@nestjs/common';
import { GameProfile, Party } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

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

  async getLevel(res: Response, id: number): Promise<string | null> {
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

  async getHistory(res: Response, id: number): Promise<Party[] | null> {
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
}
