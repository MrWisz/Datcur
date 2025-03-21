export class UpdateUserDto {
    readonly nombre?: string;
    readonly email?: string;
    readonly telefono?: string;
    readonly direccion?: {
      calle?: string;
      ciudad?: string;
      pais?: string;
    };
    readonly gustos?: string[];
    readonly foto_perfil?: string;
    readonly password_hash?: string;
    readonly favoritos?: string[];
    readonly seguidores?: string[];
    readonly seguidos?: string[];
    readonly fecha_registro?: Date;
  }