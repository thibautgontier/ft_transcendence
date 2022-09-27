import { User } from '.prisma/client';
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { FtOauthGuard } from './guards/ft-oauth.guard';

@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  async login() {
    return;
  }

  @Get('42')
  @UseGuards(FtOauthGuard)
  ftAuth() {
    return;
  }

  @Get('42/return')
  @UseGuards(FtOauthGuard)
  async ftAuthCallback(@Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login();
    if (result) {
      const obj = JSON.stringify({
        nickname: result.nickname,
        id: result.id,
        avatar: result.avatar,
        accessToken: result.accessToken,
        twoFA: result.twoFA,
      });
      res.cookie('user', obj, {
        httpOnly: false,
      });
      res.status(302).redirect('http://localhost:8080/');
    } else {
      console.log('failed to find user');
    }
  }

  @Get('logout')
  async logOut(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
    if (user) await this.authService.logout(user);
    res.status(200).send('successful logout');
  }

  @Get('2fa')
  async setup2fa(@Req() req: Request) {
    const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
    this.authService.setup2fa(user);
  }

  @Post('validate2fa')
  async validate2fa(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
    const validate = await this.authService.validate2faCode(req.body.code, user);
    res.status(200).send(validate);
  }

  @Post('2faemail')
  async change2faEmail(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.findUser(req.headers.authorization.split(' ')[1]);
    if (req.body.email) {
      const result = await this.authService.changeEmail(user, req.body.email);
      res.status(200).send(result);
    }
  }
}
