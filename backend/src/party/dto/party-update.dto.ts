import { ApiProperty } from '@nestjs/swagger';
import { partyStatus } from '@prisma/client';

export class PartyUpdateDto {
  @ApiProperty({
    required: false,
  })
  playerOne?: number;

  @ApiProperty({
    required: false,
  })
  playerTwo?: number;

  @ApiProperty({
    required: false,
  })
  winner?: number;

  @ApiProperty({
    required: false,
  })
  status?: partyStatus;
}
