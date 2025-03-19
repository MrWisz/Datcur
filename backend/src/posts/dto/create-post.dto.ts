export class CreatePostDto {
    readonly usuario_id: string;
    readonly descripcion: string;
    readonly fotos: string[];
    readonly etiquetas: string[];
    readonly fecha_creacion: Date;
    readonly likes: string[];
    readonly comentarios: {
      usuario_id: string;
      comentario: string;
      fecha_comentario: Date;
    }[];
    readonly favoritos: string[];
  }