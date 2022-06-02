import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signIn(): Promise<any> {
    return Promise.resolve({
      test: 'toto',
    });
  }
}
