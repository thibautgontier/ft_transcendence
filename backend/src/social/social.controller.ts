import { Controller, Get, Put, Param } from '@nestjs/common';
import { SocialProfile, User } from '@prisma/client';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
  constructor(private socialService: SocialService) {}

  @Get(':id')
  async getSocial(@Param('id') id: number): Promise<SocialProfile> {
    return await this.socialService.getSocialProfile(Number(id));
  }

  @Get(':id/friends')
  async getFriends(@Param('id') id: number): Promise<User[]> {
    return await this.socialService.getFriends(Number(id));
  }

  @Put(':id/friends/add/:friendId')
  async addFriend(
    @Param('id') id: number,
    @Param('friendId') friendId: number,
  ): Promise<SocialProfile> {
    return await this.socialService.addFriend(Number(id), Number(friendId));
  }
}
