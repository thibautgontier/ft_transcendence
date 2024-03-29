import { HttpStatus, Injectable } from '@nestjs/common';
import { Channel, SocialProfile, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  async getSocialProfile(
    res: Response,
    userID: number,
  ): Promise<SocialProfile | null> {
    try {
      const profile = await this.prisma.socialProfile.findUnique({
        where: { UserID: userID },
      });
      res.status(HttpStatus.OK).send(profile);
      return profile;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send(error);
      return null;
    }
  }

  async getFriends(res: Response, userID: number): Promise<User[]> {
    try {
      const profile = await this.prisma.socialProfile.findUnique({
        where: { UserID: userID },
        select: { Friends: true },
      });
      res.status(HttpStatus.OK).send(profile.Friends);
      return profile.Friends;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send(error);
      return null;
    }
  }

  async isFriend(
    res: Response,
    userID: number,
    otherID: number,
  ): Promise<boolean> {
    try {
      const profile = await this.prisma.socialProfile.findUnique({
        where: { UserID: userID },
        select: { Friends: true },
      });
      if (profile.Friends.find((User) => User.id == otherID) != undefined) {
        res.status(HttpStatus.OK).send(true);
        return true;
      }
      res.status(HttpStatus.OK).send(false);
      return false;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send(error);
      return null;
    }
  }

  async addFriend(
    res: Response,
    userID: number,
    friendID: number,
  ): Promise<SocialProfile | null> {
    try {
      if (userID === friendID)
        throw new Error('You cannot add yourself as a friend');
      const profile = await this.prisma.socialProfile.update({
        where: { UserID: userID },
        data: { Friends: { connect: { id: friendID } } },
        include: { Friends: true },
      });
      res.status(HttpStatus.OK).send(profile);
      return profile;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send(error);
      return null;
    }
  }

  async removeFriend(
    res: Response,
    userID: number,
    friendID: number,
  ): Promise<SocialProfile | null> {
    try {
      if (userID === friendID)
        throw new Error('You cannot remove yourself as a friend');
      const profile = await this.prisma.socialProfile.update({
        where: { UserID: userID },
        data: { Friends: { disconnect: { id: friendID } } },
        include: { Friends: true },
      });
      res.status(HttpStatus.OK).send(profile);
      return profile;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send(error);
      return null;
    }
  }

  async getBlocked(res: Response, userID: number): Promise<User[]> {
    try {
      const profile = await this.prisma.socialProfile.findUnique({
        where: { UserID: userID },
        select: { Blocked: true },
      });
      res.status(HttpStatus.OK).send(profile.Blocked);
      return profile.Blocked;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send(error);
      return null;
    }
  }

  async isBlocked(
    res: Response,
    userID: number,
    otherID: number,
  ): Promise<boolean> {
    try {
      const profile = await this.prisma.socialProfile.findUnique({
        where: { UserID: userID },
        select: { Blocked: true },
      });
      if (profile.Blocked.find((User) => User.id == otherID) != undefined) {
        res.status(HttpStatus.OK).send(true);
        return true;
      }
      res.status(HttpStatus.OK).send(false);
      return false;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send(error);
      return null;
    }
  }

  async addBlocked(
    res: Response,
    userID: number,
    blockedID: number,
  ): Promise<SocialProfile | null> {
    try {
      if (userID === blockedID)
        throw new Error('You cannot add yourself as blocked');
      const profile = await this.prisma.socialProfile.update({
        where: { UserID: userID },
        data: { Blocked: { connect: { id: blockedID } } },
        include: { Blocked: true },
      });
      res.status(HttpStatus.OK).send(profile);
      return profile;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send(error);
      return null;
    }
  }

  async removeBlocked(
    res: Response,
    userID: number,
    blockedID: number,
  ): Promise<SocialProfile | null> {
    try {
      if (userID === blockedID)
        throw new Error('You cannot remove yourself as blocked');
      const profile = await this.prisma.socialProfile.update({
        where: { UserID: userID },
        data: { Blocked: { disconnect: { id: blockedID } } },
        include: { Blocked: true },
      });
      res.status(HttpStatus.OK).send(profile);
      return profile;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send(error);
      return null;
    }
  }
}
