import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';
import { FtOauthGuard } from './guards/ft-oauth.guard';

@Controller('api/auth')
export class AuthController {
  @Get('/42/login')
  @UseGuards(FtOauthGuard)
  ftAuth() {
    return;
  }

  @Get('/42/return')
  @UseGuards(FtOauthGuard)
  @Redirect('/')
  ftAuthCallback() {
    return;
  }
}
