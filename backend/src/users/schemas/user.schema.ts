import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  telefono: string;

  @Prop({
    type: {
      calle: { type: String, required: true },
      ciudad: { type: String, required: true },
      pais: { type: String, required: true }
    },
    required: true
  })
  direccion: {
    calle: string;
    ciudad: string;
    pais: string;
  };

  @Prop({ type: [String], required: false })
  gustos: string[];

  @Prop({ required: false })
  foto_perfil: string;

  @Prop({ required: false })
  password_hash: string;

  @Prop({ type: [Types.ObjectId], ref: 'Publicacion' })
  favoritos: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  seguidores: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  seguidos: Types.ObjectId[];

  @Prop({ required: true })
  fecha_registro: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.password_hash;
    return ret;
  },
});
