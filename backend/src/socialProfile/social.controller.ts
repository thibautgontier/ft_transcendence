import { Controller, Get, Param, Patch, Res, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Channel, SocialProfile, User } from '@prisma/client';
import { Response, Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { SocialService } from './social.service';

@ApiTags('social')
@Controller('social')
export class SocialController {
  constructor(private socialService: SocialService, private authService: AuthService) {}

  @Get(':userID')
  async getSocial(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<SocialProfile> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.socialService.getSocialProfile(res, Number(userID));
    }
  }

  @Get(':userID/friend')
  async getFriends(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<User[]> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.socialService.getFriends(res, Number(userID));
    }
  }

  @Get(':userID/isFriend/:otherID')
  async isFriend(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('otherID') otherID: number,
  ): Promise<boolean> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.socialService.isFriend(res, Number(userID), Number(otherID));
    }
  }

  @Patch(':userID/friend/add/:friendID')
  async addFriend(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('friendID') friendID: number,
  ): Promise<SocialProfile | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.socialService.addFriend(
          res,
          Number(userID),
          Number(friendID),
        );
      }
    }
  }

  @Patch(':userID/friend/remove/:friendID')
  async removeFriend(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('friendID') friendID: number,
  ): Promise<SocialProfile | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.socialService.removeFriend(
          res,
          Number(userID),
          Number(friendID),
        );
      }
    }
  }

  @Get(':userID/blocked')
  async getBlockeds(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
  ): Promise<User[]> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.socialService.getBlocked(res, Number(userID));
    }
  }

  @Get(':userID/isBlocked/:otherID')
  async isBlocked(
    @Req() req: Request,
    @Res() res: Response,
	  @Param('userID') userID: number,
    @Param('otherID') otherID: number,
  ): Promise<boolean> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) return await this.socialService.isBlocked(res, Number(userID), Number(otherID));
    }
  }

  @Patch(':userID/blocked/add/:blockedID')
  async addBlocked(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('blockedID') blockedID: number,
  ): Promise<SocialProfile | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.socialService.addBlocked(
          res,
          Number(userID),
          Number(blockedID),
        );
      }
    }
  }

  @Patch(':userID/blocked/remove/:blockedID')
  async removeBlocked(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userID') userID: number,
    @Param('blockedID') blockedID: number,
  ): Promise<SocialProfile | null> {
    if (req.headers.authorization) {
      const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
      if (user) {
        return await this.socialService.removeBlocked(
          res,
          Number(userID),
          Number(blockedID),
        );
      }
    }
  }
}
