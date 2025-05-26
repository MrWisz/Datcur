import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//import { Document, Types } from 'mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  usuario_id: Types.ObjectId;

  @Prop({ required: true })
  comentario: string;

  @Prop({ required: true })
  fecha_comentario: Date;

  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

}

@Schema()
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  usuario_id: Types.ObjectId;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ type: [String], required: true })
  fotos: string[];

  @Prop({ type: [String], required: true })
  etiquetas: string[];

  @Prop({ required: true })
  fecha_creacion: Date;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  likes: Types.ObjectId[];

  @Prop({ type: [Comment], default: [] })
  comentarios: Comment[];

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  favoritos: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
export const CommentSchema = SchemaFactory.createForClass(Comment);