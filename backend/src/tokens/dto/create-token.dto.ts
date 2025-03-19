export class CreateTokenDto {
    readonly usuario_id: string;
    readonly token: string;
    readonly fecha_creacion: Date;
    readonly fecha_expiracion: Date;
  }