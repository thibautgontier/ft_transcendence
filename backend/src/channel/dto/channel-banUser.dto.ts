import { ApiProperty } from "@nestjs/swagger";

export class BanOrMuteUserDto {
	@ApiProperty({
		required: true,
	})
	idUser: number;

	@ApiProperty({
		required: true,
	})
	idAdmin: number;

	@ApiProperty({
		required: true,
	})
	reason: string;

	@ApiProperty({
		required: true,
	})
	duration: number;

	@ApiProperty({
		required: true,
	})
	idChan: number;

	@ApiProperty({
		required: true,
	})
	Sanction: string;
}