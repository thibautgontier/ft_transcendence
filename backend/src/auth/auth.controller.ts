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
    // return await this.authService.login();
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
  async logOut(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const user = await this.authService.findUser(token);
    console.log('Logging out user');
  }

  // async enable2FA(@Req() req: Request, @Res() res: Response) {
  //   const token = req.headers.authorization.split(' ')[1];
  //   const user = await this.authService.findUser(token);
  //   if (user) {
  //     const secret = speakeasy.generateSecret();
  //     qrcode.toDataURL(secret.otpauth_url, function (err, qrImage) {
  //       if (!err) res.status(200).send({ qr: qrImage, secret: secret });
  //       else return;
  //     });
  //   } else res.status(404).send();
  // }

  @Post('test')
  test(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    console.log('in here boy,', token);
    return;
  }
}
