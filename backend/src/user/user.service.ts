import { HttpStatus, Injectable } from '@nestjs/common';
import { User, logStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll(gameProfile: boolean): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        gameProfileRef: gameProfile,
      },
    });
  }

  async findID(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: id } });
  }

  async findToken(token: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { token: token } });
  }

  async getByFilter(status: logStatus, twoFA: boolean): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { status: status, twoFA: twoFA },
    });
  }

  async createUser(
    res: Response,
    token: string,
    refreshToken: string,
  ): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          token: token,
          refreshToken: refreshToken,
          gameProfileRef: {
            create: {},
          },
        },
      });
      res.status(HttpStatus.CREATED).send(user);
      return user;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: "Can't create user",
      });
      return null;
    }
  }

  async deleteUser(res: Response, id: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.delete({ where: { id: id } });
      res.status(HttpStatus.OK).send(user);
      return user;
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Can't delete user",
      });
      return null;
    }
  }
}
