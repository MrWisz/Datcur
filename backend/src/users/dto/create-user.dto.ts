import { IsEmail, IsNotEmpty, IsString, IsArray, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DireccionDto {
  @IsString()
  calle: string;

  @IsString()
  ciudad: string;

  @IsString()
  pais: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  telefono: string;

  @ValidateNested()
  @Type(() => DireccionDto)
  direccion: DireccionDto;

  @IsArray()
  @IsString({ each: true })
  gustos: string[];

  @IsString()
  foto_perfil: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsDateString()
  fecha_registro: Date;
}
