import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SocialProfile, User } from '@prisma/client';
import { SocialService } from './social.service';

@ApiTags('social')
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

  @Patch(':id/friends/add/:friendId')
  async addFriend(
    @Param('id') id: number,
    @Param('friendId') friendId: number,
  ): Promise<SocialProfile> {
    return await this.socialService.addFriend(Number(id), Number(friendId));
  }

  @Patch(':id/friends/remove/:friendId')
  async removeFriend(
    @Param('id') id: number,
    @Param('friendId') friendId: number,
  ): Promise<SocialProfile> {
    return await this.socialService.removeFriend(Number(id), Number(friendId));
  }
}
