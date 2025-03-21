export class UpdatePostDto {
    readonly descripcion?: string;
    readonly fotos?: string[];
    readonly etiquetas?: string[];
    readonly likes?: string[];
    readonly comentarios?: {
      usuario_id: string;
      comentario: string;
      fecha_comentario: Date;
    }[];
    readonly favoritos?: string[];
  }