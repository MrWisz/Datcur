import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Token extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  usuario_id: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  fecha_creacion: Date;

  @Prop({ required: true })
  fecha_expiracion: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);