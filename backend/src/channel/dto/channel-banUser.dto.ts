import { ApiProperty } from "@nestjs/swagger";

export class BanUserDto {
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
		required: false,
	})
	duration: string;

	@ApiProperty({
		required: false,
	})
	idChan: number;
}