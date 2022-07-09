import { Controller, Get, Param, Patch, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Channel, SocialProfile, User } from '@prisma/client';
import { Response } from 'express';
import { SocialService } from './social.service';

@ApiTags('social')
@Controller('social')
export class SocialController {
  constructor(private socialService: SocialService) {}

  @Get(':id')
  async getSocial(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<SocialProfile> {
    return await this.socialService.getSocialProfile(res, Number(id));
  }

  @Get(':id/friend')
  async getFriends(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<User[]> {
    return await this.socialService.getFriends(res, Number(id));
  }

  @Patch(':id/friend/add/:friendId')
  async addFriend(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('friendId') friendId: number,
  ): Promise<SocialProfile | null> {
    return await this.socialService.addFriend(
      res,
      Number(id),
      Number(friendId),
    );
  }

  @Patch(':id/friend/remove/:friendId')
  async removeFriend(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('friendId') friendId: number,
  ): Promise<SocialProfile | null> {
    return await this.socialService.removeFriend(
      res,
      Number(id),
      Number(friendId),
    );
  }

  @Get(':id/channel')
  async getChannels(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<Channel[]> {
    return await this.socialService.getChannels(res, Number(id));
  }

  @Patch(':id/channel/add/:channelId')
  async addChannel(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('channelId') channelId: number,
  ): Promise<SocialProfile | null> {
    return await this.socialService.addChannel(
      res,
      Number(id),
      Number(channelId),
    );
  }

  @Patch(':id/channel/remove/:channelId')
  async removeChannel(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('channelId') channelId: number,
  ): Promise<SocialProfile | null> {
    return await this.socialService.removeChannel(
      res,
      Number(id),
      Number(channelId),
    );
  }

  @Get(':id/blocked')
  async getBlockeds(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<User[]> {
    return await this.socialService.getBlocked(res, Number(id));
  }

  @Patch(':id/blocked/add/:blockedId')
  async addBlocked(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('blockedId') blockedId: number,
  ): Promise<SocialProfile | null> {
    return await this.socialService.addBlocked(
      res,
      Number(id),
      Number(blockedId),
    );
  }

  @Patch(':id/blocked/remove/:blockedId')
  async removeBlocked(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('blockedId') blockedId: number,
  ): Promise<SocialProfile | null> {
    return await this.socialService.removeBlocked(
      res,
      Number(id),
      Number(blockedId),
    );
  }
}
