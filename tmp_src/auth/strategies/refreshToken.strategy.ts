import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback, ExtractJwt } from 'passport-42';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  '42-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'refresh-token-secret',
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: any) {
    const refreshToken = request
      .get('authorization')
      .replace('Bearer ', '')
      .trim();
    return {
      ...payload,
      refreshToken,
    };
  }
}
