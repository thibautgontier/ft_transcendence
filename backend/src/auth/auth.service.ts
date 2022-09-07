import { Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { Student } from './user.decorator';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async callBack(@Student() user: Profile) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        Email: user.emails[0].value,
      },
    });
    if (!existingUser) {
      try {
        const newuser = await this.prisma.user.create({
          data: {
            Email: user.emails[0].value,
            Nickname: user.username,
            Avatar: user.photos[0].value,
          },
        });
        return { id: newuser.id, avatar: newuser.Avatar, success: 1 };
      } catch (error) {
        return { success: 0 };
      }
    } else {
      return { id: existingUser.id, avatar: existingUser.Avatar, success: 1 };
    }
  }
}
