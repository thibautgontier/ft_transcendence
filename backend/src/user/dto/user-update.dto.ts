import { ApiProperty } from '@nestjs/swagger';
import { logStatus } from '@prisma/client';

export class UserUpdateDto {
  @ApiProperty({
    required: false,
  })
  email?: string;

  @ApiProperty({
    required: false,
  })
  nickname?: string;

  @ApiProperty({
    required: false,
  })
  token?: string;

  @ApiProperty({
    required: false,
  })
  refreshToken?: string;

  @ApiProperty({
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    required: false,
  })
  status?: logStatus;

  @ApiProperty({
    required: false,
  })
  twoFA?: boolean;
}
