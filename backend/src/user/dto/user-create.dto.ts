import { ApiProperty } from '@nestjs/swagger';
import { logStatus } from '@prisma/client';

export class UserCreateDto {
  @ApiProperty({
    required: false,
  })
  email?: string;

  @ApiProperty({
    required: false,
  })
  nickname?: string;

  @ApiProperty({
    required: true,
  })
  token: string;

  @ApiProperty({
    required: true,
  })
  refreshToken: string;

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
