import { logStatus } from '@prisma/client';

export class UserFilterDto {
  status?: logStatus;
  twoFA?: string;
  gameProfile?: string;
  socialProfile?: string;
}
