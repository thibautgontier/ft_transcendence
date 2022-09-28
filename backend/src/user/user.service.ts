import { HttpStatus, Injectable } from '@nestjs/common';
import { Channel, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { Profile } from 'passport';

@Injectable()
export class UserService {
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

  async getAll(query: UserFilterDto): Promise<User[]> {
    const gameProfile: boolean = this.toBool(query.gameProfile);
    const social: boolean = this.toBool(query.socialProfile);
    return this.prisma.user.findMany({
      where: {
        id: Number(query.id),
        TwoFA: this.toBool(query.twoFA),
      },
      include: {
        GameProfile: gameProfile === undefined ? false : gameProfile,
        SocialProfile: social === undefined ? false : social,
      },
    });
  }

  async getChannel(res: Response, userID: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userID },
        include: {
          ChannelUser: {
            include: {
              Messages: { include: { User: true } },
              Users: true,
            },
          },
        },
      });
      res.status(HttpStatus.OK).send(user);
      return user;
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Can't get channel of user",
      });
      return null;
    }
  }

  async getOtherChannel(
    res: Response,
    userID: number,
  ): Promise<Channel[] | null> {
    try {
      const chan = await this.prisma.channel.findMany({
        where: {
          AND: [
            {
              NOT: {
                Users: {
                  some: {
                    id: userID,
                  },
                },
              },
            },
            {
              NOT: {
                BanUsers: {
                  some: {
                    id: userID,
                  },
                },
              },
            },
            {
              NOT: {
                Type: 'private',
              },
            },
          ],
        },
        include: {
          Users: true,
          Messages: { include: { User: true } },
        },
      });
      res.status(HttpStatus.OK).send(chan);
      return chan;
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Can't get channel " + e,
      });
      return null;
    }
  }

  async getUser(res: Response, userID: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userID },
      });
      res.status(HttpStatus.OK).send(user);
      return user;
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Can't get user",
      });
      return null;
    }
  }

  async createUser(res: Response, body: Profile): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          Email: body.emails[0].value,
          Nickname: body.username,
          // Token: 'testtoken',
          // RefreshToken: 'testrefreshtoken',
          Avatar: 'default',
          Status: 'offline',
          TwoFA: false,
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
        Avatar: body.avatar,
        Status: body.status,
        TwoFA: body.twoFA,
      },
    });
  }

  async updateUserNickname(user: User, nickname: string, res: Response) {
    try {
      const newUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          Nickname: nickname,
        },
      });
      res.status(HttpStatus.OK).send({ message: nickname });
      return newUser;
    } catch (e) {
      res.status(200).send({ message: "nickname already taken" });
      return null;
    }
  }

  async updateUserAvatar(user: User, avatar: string, res: Response) {
    try {
      const newUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          Avatar: avatar,
        },
      });
      res.status(HttpStatus.OK).send(newUser);
      return newUser;
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Update failed',
      });
      return null;
    }
  }
}
