import { ApiProperty } from '@nestjs/swagger';

export class ChannelCreateDto {
  @ApiProperty({
    required: true,
  })
  owner: number;
}
