import { User } from '.prisma/client';
import { thisTypeAnnotation } from '@babel/types';
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
import { AuthService } from './auth.service';
import { FtOauthGuard } from './guards/ft-oauth.guard';
import { Student } from './user.decorator';

@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  login() {
    return;
  }

  @Get('42')
  @UseGuards(FtOauthGuard)
  ftAuth() {
    return;
  }

  @Get('42/return')
  @Redirect('http://localhost:8080')
  @UseGuards(FtOauthGuard)
  @Redirect('http://localhost:8080')
  async ftAuthCallback(@Student() user: User) {
    return await this.authService.callBack(user);
  }

  @Get('logout')
  @Redirect('/')
  logOut(@Req() req: Request) {
    console.log('logout');
    req.logOut();
  }
}
