import { User } from '.prisma/client';
import {
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { FtOauthGuard } from './guards/ft-oauth.guard';
import { JwtAuthGuard } from './guards/jwt.auth.guard';

@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  async login() {
    return;
    // return await this.authService.login();
  }

  @Get('42')
  @UseGuards(FtOauthGuard)
  ftAuth() {
    return;
  }

  @Get('42/return')
  @UseGuards(FtOauthGuard)
  // @Redirect('http://localhost:8080/')
  async ftAuthCallback(@Res({ passthrough: true }) res: Response) {
    console.log('in callback');
    const result = await this.authService.login();
    res.cookie('testCookie', 'hello world', {
      httpOnly: false,
    });
    console.log('returning: ', result);
    res.status(302).redirect('http://localhost:8080/');
  }

  @Get('logout')
  async logOut(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    // console.log('token:', token);
    const id = await this.authService.findUser(token);
    // if (id) {
    //   console.log('id: ', id);
    // }
  }

  @Post('test')
  @UseGuards(JwtAuthGuard)
  test(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    console.log('in here boy,', token);
    return;
  }
}
