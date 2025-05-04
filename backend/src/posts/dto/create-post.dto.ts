import {
  IsString,
  IsArray,
  IsDateString,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class ComentarioDto {
  @IsString()
  usuario_id: string;

  @IsString()
  comentario: string;

  @IsDateString()
  fecha_comentario: Date;
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsArray()
  @IsString({ each: true })
  fotos: string[];

  @IsArray()
  @IsString({ each: true })
  etiquetas: string[];

  @IsOptional()
  @IsDateString()
  fecha_creacion?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  likes?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComentarioDto)
  comentarios?: ComentarioDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoritos?: string[];
}
