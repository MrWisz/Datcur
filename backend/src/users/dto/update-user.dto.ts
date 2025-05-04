import {
  IsEmail,
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class DireccionDto {
  @IsOptional()
  @IsString()
  calle?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;

  @IsOptional()
  @IsString()
  pais?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DireccionDto)
  direccion?: DireccionDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gustos?: string[];

  @IsOptional()
  @IsString()
  foto_perfil?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsDateString()
  fecha_registro?: Date;
}
