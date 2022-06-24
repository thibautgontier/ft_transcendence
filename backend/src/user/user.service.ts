import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserFilterDto } from './dto/user-filter.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll(query: UserFilterDto): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        status: query.status,
        twoFA: query.twoFA,
      },
      include: {
        gameProfileRef: query.gameProfile,
      },
    });
  }

  async findID(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: id } });
  }

  async findToken(token: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { token: token } });
  }

  // async getByFilter(status: logStatus, twoFA: boolean): Promise<User[]> {
  //   return this.prisma.user.findMany({
  //     where: { status: status, twoFA: twoFA },
  //   });
  // }

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

  async updateUser(id: number, body: UserUpdateDto): Promise<User | null> {
    return await this.prisma.user.update({
      where: { id: id },
      data: {
        email: body.email,
        nickname: body.nickname,
        token: body.token,
        refreshToken: body.refreshToken,
        avatar: body.avatar,
        status: body.status,
        twoFA: body.twoFA,
      },
    });
  }
}
