import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { UserCreateDto } from './dto/user-create.dto';

@Injectable()
export class UserService {
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

  async getAll(query: UserFilterDto): Promise<User[]> {
    const gameProfile: boolean = this.toBool(query.gameProfile);
    return this.prisma.user.findMany({
      where: {
        status: query.status,
        twoFA: this.toBool(query.twoFA),
      },
      include: {
        gameProfileRef: gameProfile === undefined ? false : gameProfile,
      },
    });
  }

  async findID(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: id } });
  }

  async findToken(token: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { token: token } });
  }

  async createUser(res: Response, body: UserCreateDto): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          nickname: body.nickname,
          token: body.token,
          refreshToken: body.refreshToken,
          avatar: body.avatar,
          status: body.status,
          twoFA: body.twoFA,
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
      const user = await this.prisma.user.delete({
        where: { id: id },
        include: {
          gameProfileRef: true,
        },
      });
      await this.prisma.gameProfile.delete({
        where: { id: user.gameProfile },
      });
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
