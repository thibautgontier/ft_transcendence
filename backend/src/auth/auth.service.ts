import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { Student } from './user.decorator';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async callBack(@Student() user: User) {
    const res = { id: user.id, avatar: user.Avatar, success: 1 };
    return res;
  }

  async login() {
    const user = await this.prisma.user.findFirst({
      where: {
        Connected: false,
      },
    });
    if (!user) return;
    const res = {
      id: (await user).id,
      nickname: (await user).Nickname,
      avatar: (await user).Avatar,
      success: 1,
    };
    const newUser = await this.prisma.user.update({
      where: {
        id: (await user).id,
      },
      data: {
        Connected: true,
      },
    });
    console.log(newUser.Connected);
    return res;
  }
}
