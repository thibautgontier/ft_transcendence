import { User } from '.prisma/client';
import {
  Controller,
  Get,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { FtOauthGuard } from './guards/ft-oauth.guard';

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
  @Redirect('http://localhost:8080/')
  async ftAuthCallback() {
    return;
  }

  @Get('logout')
  @Redirect('/')
  logOut(@Req() req: Request) {
    console.log('logout');
    req.logOut();
  }
}
