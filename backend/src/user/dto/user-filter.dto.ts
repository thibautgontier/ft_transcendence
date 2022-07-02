import { ApiProperty } from '@nestjs/swagger';
import { logStatus } from '@prisma/client';

export class UserFilterDto {
  @ApiProperty()
  status?: logStatus;

  @ApiProperty()
  twoFA?: string;

  @ApiProperty()
  gameProfile?: string;

  @ApiProperty()
  socialProfile?: string;
}
