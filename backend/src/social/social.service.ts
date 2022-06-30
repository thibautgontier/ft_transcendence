import { Injectable } from '@nestjs/common';
import { SocialProfile, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  async getSocialProfile(id: number): Promise<SocialProfile> {
    return await this.prisma.socialProfile.findUnique({
      where: {
        UserId: id,
      },
    });
  }

  async getFriends(id: number): Promise<User[]> {
    const social = await this.prisma.socialProfile.findUnique({
      where: {
        UserId: id,
      },
      select: {
        Friends: true,
      },
    });
    return social.Friends;
  }

  async addFriend(id: number, friendID: number): Promise<SocialProfile> {
    return await this.prisma.socialProfile.update({
      where: {
        UserId: id,
      },
      data: {
        Friends: {
          connect: {
            id: friendID,
          },
        },
      },
      include: {
        Friends: true,
      },
    });
  }
}
