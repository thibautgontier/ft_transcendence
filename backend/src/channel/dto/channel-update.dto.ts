import { ApiProperty } from "@nestjs/swagger";
import { logStatus } from "@prisma/client";

export class ChannelUpdateDto {
  @ApiProperty({
	required: false,
  })
  name?: string;

  @ApiProperty({
	required: false,
  })
  Description?: string;
}