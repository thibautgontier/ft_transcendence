import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { Student } from './user.decorator';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async callBack(@Student() user: User) {
    return { id: user.id, avatar: user.Avatar, success: 1 };
    //   const existingUser = await this.prisma.user.findUnique({
    //     where: {
    //       Email: user.Email,
    //     },
    //   });
    //   if (!existingUser) {
    //     try {
    //       const newuser = await this.prisma.user.create({
    //         data: {
    //           Email: user.Email,
    //           Nickname: user.Nickname,
    //           Avatar: user.Avatar,
    //           AccessToken: user.AccessToken,
    //         },
    //       });
    //       return { id: newuser.id, avatar: newuser.Avatar, success: 1 };
    //     } catch (error) {
    //       return { success: 0 };
    //     }
    //   } else {
    //     return { id: existingUser.id, avatar: existingUser.Avatar, success: 1 };
    //   }
  }
}
