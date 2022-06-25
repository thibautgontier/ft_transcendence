import { logStatus } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UserFilterDto {
  @IsOptional()
  @IsEnum(logStatus)
  status;

  @IsOptional()
  @IsBoolean()
  twoFA;

  @IsOptional()
  @IsBoolean()
  gameProfile;

  @IsOptional()
  @IsBoolean()
  social;
}
