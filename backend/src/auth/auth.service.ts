import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { Student } from './user.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(): Promise<any | null> {
    const time = new Date().toJSON();
    const user = await this.prisma.user.findFirst({
      where: {
        Connected: true,
      },
    });
    if (user) {
      const token = this.loginWithCredentials(user);
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          AccessToken: token.access_token,
        },
      });
      return {
        avatar: user.Avatar,
        nickname: user.Nickname,
        id: user.id,
        success: 1,
        accessToken: token.access_token,
      };
    }
    return null;
  }

  loginWithCredentials(user: User) {
    const payload = { username: user.Nickname, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findUser(accessToken: string): Promise<number | null> {
    // console.log('token received: ', accessToken);
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          AccessToken: accessToken,
        },
      });
      if (!user) throw Error;
      console.log('token found:', user.AccessToken);
      return user.id;
    } catch (e) {
      console.log('error: ', e);
      return null;
    }
  }
}
