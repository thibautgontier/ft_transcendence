import { Injectable, Session } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private prisma: PrismaService) {
    super({
      clientID: process.env.FT_CLIENT_ID,
      clientSecret: process.env.FT_CLIENT_SECRET,
      callbackURL: '/login/42/return',
      passReqToCallback: true,
    });
  }

  async validate(
    request: { session: { accessToken: string } },
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ): Promise<any> {
    //request.session.accessToken = accessToken;
    const existingUser = await this.prisma.user.findUnique({
      where: {
        Email: profile.emails[0].value,
      },
    });
    if (!existingUser) {
      const user = await this.prisma.user.create({
        data: {
          Nickname: profile.username,
          Email: profile.emails[0].value,
          Avatar: profile.photos[0].value,
          AccessToken: accessToken,
          SocialProfile: { create: {} },
		  GameProfile: { create: {} },
        },
      });
      return cb(null, user);
    }
    return cb(null, existingUser);
  }
}

//rewatch how to make html send access tokens, this token comes from 42 auth.
