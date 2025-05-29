import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//import { Document, Types } from 'mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ _id: false }) // subdocumento no necesita _id por defecto, ya lo defines manual
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

export const CommentSchema = SchemaFactory.createForClass(Comment);

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

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes: Types.ObjectId[];

  @Prop({ type: [CommentSchema], default: [] }) // importante usar el schema aquí
  comentarios: Comment[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  favoritos: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

// ------ MIDDLEWARE DE PROTECCIÓN ANTI-STRINGS ------
PostSchema.pre('findOneAndUpdate', function (next) {
  const update: any = this.getUpdate();

  if (update?.$set?.favoritos && Array.isArray(update.$set.favoritos)) {
    update.$set.favoritos = update.$set.favoritos.map(id =>
      typeof id === 'string' ? new Types.ObjectId(id) : id
    );
  }
  if (update?.$set?.likes && Array.isArray(update.$set.likes)) {
    update.$set.likes = update.$set.likes.map(id =>
      typeof id === 'string' ? new Types.ObjectId(id) : id
    );
  }
  next();
});
