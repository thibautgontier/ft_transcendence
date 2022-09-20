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
          Connected: false,
        },
      });
      return {
        avatar: user.Avatar,
        nickname: user.Nickname,
        id: user.id,
        accessToken: token.access_token,
        twoFA: user.TwoFA,
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

  async findUser(accessToken: string): Promise<User | null> {
    // console.log('token received: ', accessToken);
    try {
      const tokenUser = this.jwtService.decode(accessToken);
      console.log(typeof tokenUser);
      if (typeof tokenUser !== 'object') {
        const username = JSON.parse(tokenUser.toString());
        console.log('username: ', username);
      }
      // console.log('obj: ', typeof obj);
      const user = await this.prisma.user.findUnique({
        where: {
          Nickname: 'jabenjam',
        },
      });
      if (!user) throw Error;
      return user;
    } catch (e) {
      console.log('boy: ', e);
      return null;
    }
  }
}
