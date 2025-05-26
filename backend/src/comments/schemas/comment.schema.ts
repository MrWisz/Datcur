import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  usuario_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  publicacion_id: Types.ObjectId;

  @Prop({ required: true })
  comentario: string;

  @Prop({ required: true })
  fecha_comentario: Date;
}


export const CommentSchema = SchemaFactory.createForClass(Comment);
