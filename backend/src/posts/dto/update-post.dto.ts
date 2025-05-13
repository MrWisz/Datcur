import {
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsDateString
} from 'class-validator';
import { Type } from 'class-transformer';

class ComentarioDto {
  @IsString()
  @IsOptional()
  usuario_id?: string;

  @IsString()
  @IsOptional()
  comentario?: string;

  @IsDateString()
  @IsOptional()
  fecha_comentario?: Date;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fotos?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  etiquetas?: string[];

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
