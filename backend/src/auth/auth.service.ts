import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { Student } from './user.decorator';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(): Promise<User | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          Nickname: "mbaxmann",
        },
      });
      if (!user) throw Error;
      const newUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          Connected: true,
        },
      });
      return user;
    } catch (e) {
      console.log('error', e, 'get login');
      return null;
    }
  }
}
