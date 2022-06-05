import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-42';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  '42-access',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'access-token-secret',
    });
  }

  validate(payload: any) {
    return payload;
  }
}
