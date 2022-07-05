import { ApiProperty } from '@nestjs/swagger';
import { logStatus } from '@prisma/client';

export class UserFilterDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Id of the user',
  })
  id?: number;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Token of the user',
  })
  token?: string;

  @ApiProperty({
    enum: logStatus,
    required: false,
    description: 'Status of the user',
  })
  status?: logStatus;

  @ApiProperty({
    required: false,
    type: String,
    description: 'TwoFA of the user',
  })
  twoFA?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'GameProfile of the user',
  })
  gameProfile?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'SocialProfile of the user',
  })
  socialProfile?: string;
}
