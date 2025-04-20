import { IsString, IsArray, IsDate, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  readonly usuario_id: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsArray()
  readonly fotos: string[];

  @IsArray()
  readonly etiquetas: string[];

  @IsDate()
  readonly fecha_creacion: Date;

  @IsArray()
  readonly likes: string[];

  @IsArray()
  readonly comentarios: {
    usuario_id: string;
    comentario: string;
    fecha_comentario: Date;
  }[];

  @IsArray()
  readonly favoritos: string[];
}