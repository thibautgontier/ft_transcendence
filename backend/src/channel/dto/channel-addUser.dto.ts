import { ApiProperty } from "@nestjs/swagger";

export class ChannelAddUserDto {
	@ApiProperty({
		required: true,
	})
	users_id: number;
}