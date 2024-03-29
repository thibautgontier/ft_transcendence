import { ApiProperty } from "@nestjs/swagger";

export class ChannelAddUserDto {
	@ApiProperty({
		required: true,
	})
	user_id: number;

	@ApiProperty({
		required: false,
	})
	password?: string;
}