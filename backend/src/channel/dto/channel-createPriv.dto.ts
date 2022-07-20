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
}
