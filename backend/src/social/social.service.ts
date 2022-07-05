import { HttpStatus, Injectable } from '@nestjs/common';
import { SocialProfile, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  async getSocialProfile(
    res: Response,
    id: number,
  ): Promise<SocialProfile | null> {
    try {
      const profile = await this.prisma.socialProfile.findUnique({
        where: { UserId: id },
      });
      res.status(HttpStatus.OK).send(profile);
      return profile;
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async getFriends(res: Response, id: number): Promise<User[]> {
    try {
      const profile = await this.prisma.socialProfile.findUnique({
        where: { UserId: id },
        select: { Friends: true },
      });
      res.status(HttpStatus.OK).send(profile.Friends);
      return profile.Friends;
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('User not found');
      return null;
    }
  }

  async addFriend(
    res: Response,
    id: number,
    friendID: number,
  ): Promise<SocialProfile | null> {
    if (id === friendID) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send('You cannot add yourself as a friend');
      return null;
    }
    const profile = await this.prisma.socialProfile.update({
      where: { UserId: id },
      data: { Friends: { connect: { id: friendID } } },
      include: { Friends: true },
    });
    res.status(HttpStatus.OK).send(profile);
    return profile;
  }

  async removeFriend(
    res: Response,
    id: number,
    friendID: number,
  ): Promise<SocialProfile | null> {
    if (id === friendID) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send('You cannot remove yourself as a friend');
      return null;
    }
    const profile = await this.prisma.socialProfile.update({
      where: { UserId: id },
      data: { Friends: { disconnect: { id: friendID } } },
      include: { Friends: true },
    });
    res.status(HttpStatus.OK).send(profile);
    return profile;
  }
}
