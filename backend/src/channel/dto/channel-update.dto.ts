import { ApiProperty } from '@nestjs/swagger';

export class ChannelUpdateDto {
  @ApiProperty({
    required: false,
  })
  name?: string;

  @ApiProperty({
    required: false,
  })
  Description?: string;

  @ApiProperty({
    required: false,
  })
  RoomId: string;
}
