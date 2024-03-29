import { HttpStatus, Injectable } from '@nestjs/common';
import { Party } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PartyUpdateDto } from './dto/party-update.dto';
import { Response } from 'express';

@Injectable()
export class PartyService {
  constructor(private prisma: PrismaService) {}

  async getParty(id: number): Promise<Party[]> {
    return this.prisma.party.findMany({
      where: { id: id },
      include: {
        PlayerOne: { select: { id: true, Nickname: true } },
        PlayerTwo: { select: { id: true, Nickname: true } },
        Winner: { select: { id: true, Nickname: true } },
      },
    });
  }

  async createParty(winnerId: string, loserId: string): Promise<Party> {
    return await this.prisma.party.create({
      data: {
        PlayerOneID: Number(winnerId),
        PlayerTwoID: Number(loserId),
        WinnerID: Number(winnerId),
      },
      include: {
        PlayerOne: { select: { id: true, Nickname: true } },
        PlayerTwo: { select: { id: true, Nickname: true } },
        Winner: { select: { id: true, Nickname: true } },
      },
    });
  }

  async updateParty(
    body: PartyUpdateDto,
    id: number,
    res: Response,
  ): Promise<Party | null> {
    try {
      const party = await this.prisma.party.update({
        where: { id: id },
        data: {
          PlayerOneID: body.playerOne,
          PlayerTwoID: body.playerTwo,
          WinnerID: body.winner,
          Status: body.status,
        },
        include: {
          PlayerOne: { select: { id: true, Nickname: true } },
          PlayerTwo: { select: { id: true, Nickname: true } },
          Winner: { select: { id: true, Nickname: true } },
        },
      });
      res.status(HttpStatus.OK).send(party);
      return party;
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(error);
      return null;
    }
  }

  async deleteParty(id: number, res: Response): Promise<Party | null> {
    try {
      const party = await this.prisma.party.delete({
        where: { id: id },
        include: {
          PlayerOne: { select: { id: true, Nickname: true } },
          PlayerTwo: { select: { id: true, Nickname: true } },
          Winner: { select: { id: true, Nickname: true } },
        },
      });
      res.status(HttpStatus.OK).send(party);
      return party;
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(error);
      return null;
    }
  }

  async finishGame(winnerId: string, loserId: string) {
    await this.prisma.gameProfile.update({
      where: {
        id: Number(winnerId),
      },
      data: {
        NbWin: {
          increment: 1,
        },
        Xp: {
          increment: 20,
        },
        NbParty: {
          increment: 1,
        }
      },
    });
    await this.prisma.gameProfile.update({
      where: {
        id: Number(loserId),
      },
      data: {
        Xp: {
          increment: 10,
        },
        NbParty: {
          increment: 1,
        }
      },
    });
    await this.prisma.gameProfile.updateMany({
      where: {
        Xp: {
          gte: 100,
        },
      },
      data: {
        Level: {
          increment: 1,
        },
        Xp: {
          decrement: 100,
        },
      }
    });
  }
}