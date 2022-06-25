import { logStatus } from '@prisma/client';

export class UserCreateDto {
  email?: string;
  nickname?: string;
  token: string;
  refreshToken: string;
  avatar?: string;
  status?: logStatus;
  twoFA?: boolean;
}
