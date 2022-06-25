import { logStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UserFilterDto {
  @IsOptional()
  @IsEnum(logStatus)
  status;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  twoFA;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  gameProfile;
}
