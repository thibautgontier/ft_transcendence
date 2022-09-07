import {
  Controller,
  Get,
  Redirect,
  Req,
  UseGuards,
  Session,
} from '@nestjs/common';
import { Request } from 'express';
import { Profile } from 'passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { FtOauthGuard } from './guards/ft-oauth.guard';
import { Student } from './user.decorator';

@Controller('login')
export class AuthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async login(@Req() req: Request, @Session() session: Record<string, any>) {
    console.log('session id: ', session.id);
    const user = await this.prisma.user.findUnique({
      where: {
        id: 1,
      },
    });
    if (!user)
      return {
        success: 0,
      };
    return {
      username: user.Nickname,
      id: user.id,
      photo: user.Avatar,
      success: 1,
    };
  }

  @Get('42')
  @UseGuards(FtOauthGuard)
  ftAuth() {
    return;
  }

  @Get('42/return')
  @UseGuards(FtOauthGuard)
  @Redirect('http://localhost:3000/login')
  async ftAuthCallback(@Student() user: Profile) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        Email: user.emails[0].value,
      },
    });
    if (!existingUser) {
      await this.prisma.user.create({
        data: {
          Email: user.emails[0].value,
          Nickname: user.username,
          Avatar: user.photos[0].value,
        },
      });
    }
	//console.log('TEST', existingUser.Avatar);
    return;
  }

  @Get('logout')
  @Redirect('/')
  logOut(@Req() req: Request) {
    console.log('logout');
    req.logOut();
  }
}
