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
    const social: boolean = this.toBool(query.socialProfile);
    return this.prisma.user.findMany({
      where: {
        id: Number(query.id),
        Token: query.token,
        Status: query.status,
        TwoFA: this.toBool(query.twoFA),
      },
      include: {
        GameProfile: gameProfile === undefined ? false : gameProfile,
        SocialProfile: social === undefined ? false : social,
      },
    });
  }

  async createUser(res: Response, body: UserCreateDto): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          Email: body.email,
          Nickname: body.nickname,
          Token: body.token,
          RefreshToken: body.refreshToken,
          Avatar: body.avatar,
          Status: body.status,
          TwoFA: body.twoFA,
          GameProfile: { create: {} },
          SocialProfile: { create: {} },
        },
      });

      //TODO: here, add code to call 42 API for get user's data

      res.status(HttpStatus.CREATED).send(user);
      return user;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send({ error });
      return null;
    }
  }

  async deleteUser(res: Response, userID: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.delete({
        where: { id: userID },
        include: {
          GameProfile: true,
          SocialProfile: true,
        },
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

  async updateUser(userID: number, body: UserUpdateDto): Promise<User | null> {
    return await this.prisma.user.update({
      where: { id: userID },
      data: {
        Email: body.email,
        Nickname: body.nickname,
        Token: body.token,
        RefreshToken: body.refreshToken,
        Avatar: body.avatar,
        Status: body.status,
        TwoFA: body.twoFA,
      },
    });
  }
}
