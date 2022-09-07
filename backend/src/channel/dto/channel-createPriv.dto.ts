import { ApiProperty } from '@nestjs/swagger';

export class ChannelCreatePrivDto {
  @ApiProperty({
    required: true,
  })
  user_1: number;

  @ApiProperty({
    required: true,
  })
  user_2: number;

  @ApiProperty({
	required: true,
  })
  Name: string;

  @ApiProperty({
    required: true,
  })
  RoomId: string;
}
