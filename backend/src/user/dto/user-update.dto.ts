import { ApiProperty } from '@nestjs/swagger';
import { logStatus } from '@prisma/client';

export class UserUpdateDto {
  @ApiProperty()
  email?: string;

  @ApiProperty()
  nickname?: string;

  @ApiProperty()
  token?: string;

  @ApiProperty()
  refreshToken?: string;

  @ApiProperty()
  avatar?: string;

  @ApiProperty()
  status?: logStatus;

  @ApiProperty()
  twoFA?: boolean;
}
