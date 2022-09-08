import { ApiProperty } from '@nestjs/swagger';

export class ChannelSendMsgDto {
  @ApiProperty({
    required: true,
  })
  Content: string;
}