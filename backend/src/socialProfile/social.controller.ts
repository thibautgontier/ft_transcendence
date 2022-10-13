import { Controller, Get, Param, Patch, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Channel, SocialProfile, User } from '@prisma/client';
import { Response } from 'express';
import { SocialService } from './social.service';

@ApiTags('social')
@Controller('social')
export class SocialController {
  constructor(private socialService: SocialService) {}

  @Get(':userID')
  async getSocial(
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<SocialProfile> {
    return await this.socialService.getSocialProfile(res, Number(userID));
  }

  @Get(':userID/friend')
  async getFriends(
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<User[]> {
    return await this.socialService.getFriends(res, Number(userID));
  }

  @Get(':userID/isFriend/:otherID')
  async isFriend(
    @Res() res: Response,
	@Param('userID') userID: number,
    @Param('otherID') otherID: number,
  ): Promise<boolean> {
    return await this.socialService.isFriend(res, Number(userID), Number(otherID));
  }

  @Patch(':userID/friend/add/:friendID')
  async addFriend(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('friendID') friendID: number,
  ): Promise<SocialProfile | null> {
    return await this.socialService.addFriend(
      res,
      Number(userID),
      Number(friendID),
    );
  }

  @Patch(':userID/friend/remove/:friendID')
  async removeFriend(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('friendID') friendID: number,
  ): Promise<SocialProfile | null> {
    return await this.socialService.removeFriend(
      res,
      Number(userID),
      Number(friendID),
    );
  }

  @Get(':userID/blocked')
  async getBlockeds(
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<User[]> {
    return await this.socialService.getBlocked(res, Number(userID));
  }

  @Get(':userID/isBlocked/:otherID')
  async isBlocked(
    @Res() res: Response,
	@Param('userID') userID: number,
    @Param('otherID') otherID: number,
  ): Promise<boolean> {
    return await this.socialService.isBlocked(res, Number(userID), Number(otherID));
  }

  @Patch(':userID/blocked/add/:blockedID')
  async addBlocked(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('blockedID') blockedID: number,
  ): Promise<SocialProfile | null> {
    return await this.socialService.addBlocked(
      res,
      Number(userID),
      Number(blockedID),
    );
  }

  @Patch(':userID/blocked/remove/:blockedID')
  async removeBlocked(
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('blockedID') blockedID: number,
  ): Promise<SocialProfile | null> {
    return await this.socialService.removeBlocked(
      res,
      Number(userID),
      Number(blockedID),
    );
  }
}
