import { logStatus } from '@prisma/client';

export class UserUpdateDto {
  email?: string;
  nickname?: string;
  token?: string;
  refreshToken?: string;
  avatar?: string;
  status?: logStatus;
  twoFA?: boolean;
}
