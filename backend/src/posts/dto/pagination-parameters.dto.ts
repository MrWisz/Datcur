import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PaginationParameters {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  limit: number = 2;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  skip: number = 0;

  @IsOptional()
  @IsString()
  userId?: string; 
}
