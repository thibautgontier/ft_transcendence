import { ApiProperty } from '@nestjs/swagger';

export class ChannelSwitchToPrivate {
  @ApiProperty({
    required: true,
  })
  Password: string;
}
