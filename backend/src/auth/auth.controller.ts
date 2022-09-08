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
  async login() {
    return await this.authService.login();
  }

  @Get('42')
  @UseGuards(FtOauthGuard)
  ftAuth() {
    return;
  }

  @Get('42/return')
  @UseGuards(FtOauthGuard)
<<<<<<< HEAD
  @Redirect('http://localhost:5000')
=======
  @Redirect('http://localhost:8080/')
>>>>>>> cfa5c92e550c7360f0c04d9514a17a1bef11e6b0
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
