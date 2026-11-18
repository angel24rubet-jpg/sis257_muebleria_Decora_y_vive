
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  // Iniciar sesion
  async login(datos: { usuario: string; password: string }) {
    const usuario = await this.usuariosService.buscarParaLogin(
      datos.usuario,
    );

    if (!usuario) {
      throw new UnauthorizedException('Usuario o contrasena incorrectos');
    }

    if (!usuario.estado) {
      throw new ForbiddenException('La cuenta se encuentra desactivada');
    }

    const passwordCorrecta = await bcrypt.compare(
      datos.password,
      usuario.password,
    );

    if (!passwordCorrecta) {
      throw new UnauthorizedException('Usuario o contrasena incorrectos');
    }

    const payload = {
      sub: usuario.id_usuario,
      usuario: usuario.usuario,
      rol: usuario.rol,
    };

    return {
      mensaje: 'Inicio de sesion correcto',
      access_token: await this.jwtService.signAsync(payload),
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre_completo: usuario.nombre_completo,
        usuario: usuario.usuario,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    };
  }
}
