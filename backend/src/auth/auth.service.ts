import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passwordMatch = await bcrypt.compare(pass, user.password_hash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const userObject = typeof user.toObject === 'function' ? user.toObject() : user;
    const { password_hash, ...result } = userObject;
    return result;
  }

  async login(user: any) {
  const userId = user._id?.toString?.() || user.userId || user.id;

  if (!userId) {
    throw new UnauthorizedException('No se pudo obtener el ID del usuario');
  }

  const payload = { username: user.username, sub: userId };
  return {
    access_token: this.jwtService.sign(payload),
  };
}
}
