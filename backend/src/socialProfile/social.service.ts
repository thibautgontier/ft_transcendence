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

  async getChannels(res: Response, userID: number): Promise<Channel[]> {
    try {
      const profile = await this.prisma.socialProfile.findUnique({
        where: { UserID: userID },
        select: { Channels: true },
      });
      res.status(HttpStatus.OK).send(profile.Channels);
      return profile.Channels;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send(error);
      return null;
    }
  }

  async addChannel(
    res: Response,
    userID: number,
    channelID: number,
  ): Promise<SocialProfile | null> {
    try {
      const profile = await this.prisma.socialProfile.update({
        where: { UserID: userID },
        data: { Channels: { connect: { id: channelID } } },
        include: { Channels: true },
      });
      res.status(HttpStatus.OK).send(profile);
      return profile;
    } catch (error) {
      res.status(HttpStatus.NOT_ACCEPTABLE).send(error);
      return null;
    }
  }

  async removeChannel(
    res: Response,
    userID: number,
    channelID: number,
  ): Promise<SocialProfile | null> {
    try {
      const profile = await this.prisma.socialProfile.update({
        where: { UserID: userID },
        data: { Channels: { disconnect: { id: channelID } } },
        include: { Channels: true },
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
		console.log(userID, blockedID)
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
