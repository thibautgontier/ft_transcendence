import { ApiProperty } from '@nestjs/swagger';

export class ChannelCreateDto {
  @ApiProperty({
    required: true,
  })
  owner: number;

  @ApiProperty({
    required: true,
  })
  Name: string;

  @ApiProperty({
    required: true,
  })
  RoomId: string;
}
