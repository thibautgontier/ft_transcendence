import { Controller, Get, Param, Patch, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SocialProfile, User } from '@prisma/client';
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
}
