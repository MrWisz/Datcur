import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Type } from 'class-transformer';

export class PaginationParameters {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  //limit?: number;
  limit: number = 2;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  //skip?: number;
  skip: number = 0;
}
