import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { Student } from './user.decorator';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(): Promise<any | null> {
    const time = new Date().toJSON();
    while (1) {
      const user = await this.prisma.user.findFirst({
        where: {
          UpdatedAt: {
            gt: time,
          },
        },
      });
      if (user) {
        return {
          avatar: user.Avatar,
          nickname: user.Nickname,
          id: user.id,
          success: 1,
          accessToken: user.AccessToken,
        };
      }
    }
    return null;
  }

  async findUser(accessToken: string): Promise<number | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          AccessToken: accessToken,
        },
      });
      if (!user) throw Error;
      return user.id;
    } catch (e) {
      console.log('error: ', e);
      return null;
    }
  }
}
