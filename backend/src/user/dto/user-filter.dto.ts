import { logStatus } from '@prisma/client';

export class UserFilterDto {
  status?: logStatus;
  twoFA?: boolean;
  gameProfile?: boolean;
}
