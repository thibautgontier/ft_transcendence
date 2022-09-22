import { User } from '.prisma/client';
import { Injectable, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { catchError } from 'rxjs';
import { Interface } from 'readline';
import { updateLobby } from 'colyseus';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {
  }

  async login(): Promise<any | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        Connected: true,
      },
    });
    if (user) {
      const token = this.generateTokenFromUser(user);
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          Connected: false,
        },
      });
      if (user.TwoFA) {
        const code = Math.floor(10000 + Math.random() * 9000);
        await this.prisma.user.update({
          where: {
            Nickname: user.Nickname,
          },
          data: {
            TwoFaCode: code,
          },
        });
        this.sendConfirmationEmail(user, code);
      }
      return {
        avatar: user.Avatar,
        nickname: user.Nickname,
        id: user.id,
        accessToken: token.access_token,
        twoFA: user.TwoFA,
      };
    }
    return null;
  }

  generateTokenFromUser(user: User) {
    const payload = { username: user.Nickname, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findUser(accessToken: string): Promise<User | null> {
    try {
      const tokenUser = JSON.stringify(this.jwtService.decode(accessToken));
      const username = JSON.parse(tokenUser);
      const user = await this.prisma.user.findUnique({
        where: {
          Nickname: username.username,
        },
      });
      if (!user) throw Error;
      return user;
    } catch (e) {
      console.log('boy: ', e);
      return null;
    }
  }

  async sendConfirmationEmail(user: User, code: number) {
    const email = 'tgontier@student.42.fr';
    const name = user.Nickname;
    await this.mailerService.sendMail({
      to: email,
      from: 'transcendence42verif@gmail.com',
      subject: 'Transcendence: Confirm your email',
      text:
        'Hello ' +
        name +
        ',\n\nYou need to complete this second verification in order to access your account.\n\nPlease enter the following code on the Transcendence website: ' +
        code,
    });
    return;
  }

  async setup2fa(user: User): Promise<any> {
    if (user.TwoFA) {
      try {
        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            TwoFA: false,
          },
        });
        return true;
      } catch (e) {
        return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    try {
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          TwoFA: true,
        },
      });
      return true;
    } catch (e) {
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeEmail(user: User, email: string): Promise<boolean> {
    if (user && email) {
      const test = await this.prisma.user.update({
        where: {
          Nickname: user.Nickname,
        },
        data: {
          Email: email,
        },
      });
      if (test) return true;
      else return false;
    }
    return false;
  }

  async validate2faCode(code: string, user: User) {
    if (!code) {
      throw new InternalServerErrorException;
    }
    if (code == user.TwoFaCode.toString()) {
      console.log('success');
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          TwoFaCode: null,
        },
      });
      return true;
    }
    console.log('fail');
    return false;
  }
}
